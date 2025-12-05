import { useEffect, type FC, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import type { AppDispatch, RootState } from "../store";
import {
  getStageRequest,
  deleteStageRequest,
} from "../store/stageRequestSlice";
import { InputField } from "../components/inputField";
import { StageCard } from "../components/stageCard";
import { Notification } from "../components/notification";
import { Button } from "react-bootstrap";
import { ROUTES } from "../components/routes";
import {
  setRequestData,
  updateStageRequest,
  setStages,
  deleteStageFromRequest,
  setStageData,
  updateStageInRequestAsync,
  formStageRequestAsync,
} from "../store/stageRequestSlice";
import type { Stages, StageRequestInfo } from "../store/stageRequestSlice";

export const StageRequestPage: FC = () => {
  const { id } = useParams();

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      dispatch(getStageRequest(Number(id))).then((result) => {
        if (getStageRequest.fulfilled.match(result)) {
          setOriginalStages([
            ...(result.payload.stage_request_to_stages || []),
          ]);
          setOriginalRequestInfo({
            productName: result.payload.product_name,
            createdAt: result.payload.created_at,
          });
        }
      });
    }
  }, [dispatch, id]);

  const { stages, requestInfo } = useSelector(
    (state: RootState) => state.stageRequest,
  );

  const handleCardClick = (stage_id: number | undefined) => {
    navigate(`/stages/${stage_id}`);
  };

  const isDraft = useSelector((state: RootState) => state.stageRequest.isDraft);
  const [isSaving, setIsSaving] = useState(false);
  const [isForming, setIsForming] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [originalStages, setOriginalStages] = useState<Stages[]>([]);
  const [originalRequestInfo, setOriginalRequestInfo] = useState<
    StageRequestInfo | undefined
  >(undefined);
  const [hasChanges, setHasChanges] = useState(false);

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      try {
        await dispatch(deleteStageRequest(Number(id))).unwrap();
        navigate(ROUTES.STAGES);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleProductNameChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    dispatch(
      setRequestData({
        productName: value,
      }),
    );
    setHasChanges(true);
  };

  const handleFirstStageFieldChanges = (
    stageId: number | undefined,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    if (stageId) {
      dispatch(
        setStageData({
          stageId,
          field: "input_field_1",
          value: parseFloat(value) || 0,
        }),
      );
      setHasChanges(true);
    }
  };

  const handleSecondStageFieldChanges = (
    stageId: number | undefined,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    if (stageId) {
      dispatch(
        setStageData({
          stageId,
          field: "input_field_2",
          value: parseFloat(value) || 0,
        }),
      );
      setHasChanges(true);
    }
  };

  const handleRequestSave = async () => {
    if (id) {
      setIsSaving(true);
      setNotification(null);

      try {
        await handleRequestSaveInternal();
        setNotification({
          message: "Данные успешно сохранены!",
          type: "success",
        });
      } catch (error) {
        console.error("Ошибка при сохранении:", error);
        setNotification({
          message: "Произошла ошибка при сохранении данных",
          type: "error",
        });
      } finally {
        setIsSaving(false);
        setHasChanges(false);
      }
    }
  };

  const handleFormRequest = async () => {
    if (id) {
      // Подтверждение перед формированием заявки
      const isConfirmed = window.confirm(
        "Вы уверены, что хотите сформировать заявку? После формирования заявка будет отправлена модератору и вы не сможете её редактировать.",
      );

      if (!isConfirmed) {
        return;
      }

      setIsForming(true);
      setNotification(null);

      try {
        // Сначала сохраняем все изменения
        await handleRequestSaveInternal();

        // Затем формируем заявку
        await dispatch(formStageRequestAsync(Number(id))).unwrap();

        setNotification({
          message: "Заявка успешно сформирована и отправлена модератору!",
          type: "success",
        });

        // Перенаправить через 3 секунды
        setTimeout(() => {
          navigate(ROUTES.STAGES);
        }, 3000);
      } catch (error) {
        console.error("Ошибка при формировании заявки:", error);
        setNotification({
          message: "Произошла ошибка при формировании заявки",
          type: "error",
        });
      } finally {
        setIsForming(false);
      }
    }
  };

  // Внутренняя функция сохранения для переиспользования
  const handleRequestSaveInternal = async (): Promise<void> => {
    if (!id) return;

    const requestParamsToSend = {
      ...requestInfo,
      id,
    };

    // Сохраняем название продукта
    await dispatch(
      updateStageRequest({
        requestId: Number(id),
        requestInfo: requestParamsToSend,
      }),
    ).unwrap();

    // Сохраняем данные полей для каждого этапа
    for (const stage of stages) {
      if (stage.stage_id) {
        const updateData: {
          inputField1?: number;
          inputField2?: number;
        } = {};

        // Проверяем, изменились ли значения полей
        if (stage.input_field_1 !== undefined) {
          updateData.inputField1 = stage.input_field_1;
        }

        if (stage.input_field_2 !== undefined) {
          updateData.inputField2 = stage.input_field_2;
        }

        // Отправляем обновление только если есть данные для отправки
        if (Object.keys(updateData).length > 0) {
          await dispatch(
            updateStageInRequestAsync({
              requestId: Number(id),
              stageId: stage.stage_id,
              ...updateData,
            }),
          ).unwrap();
        }
      }
    }

    // Обновляем оригинальные данные после успешного сохранения
    setOriginalStages([...stages]);
    setOriginalRequestInfo({ ...requestInfo });
  };

  const handleCancelChanges = () => {
    if (originalStages.length > 0) {
      dispatch(setStages([...originalStages]));
    }
    if (originalRequestInfo) {
      dispatch(setRequestData({ ...originalRequestInfo }));
    }
    setNotification({
      message: "Изменения отменены",
      type: "info",
    });
    setHasChanges(false);
  };

  const handleDeleteStage = async (stageId: number | undefined) => {
    if (stageId && id) {
      try {
        await dispatch(
          deleteStageFromRequest({
            requestId: Number(id),
            stageId: stageId,
          }),
        ).unwrap();
        dispatch(
          setStages(stages.filter((stage) => stage.stage_id !== stageId)),
        );
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="page-request">
      <div className="product-name">
        <h2 className="product-name--title">Введите название продукта:</h2>
        <InputField
          value={requestInfo?.productName || ""}
          searchField={false}
          placeholder="Введите название продукта"
          onChange={handleProductNameChanges}
        />
      </div>
      <div className="page-request--cards">
        {stages.length ? (
          stages.map((item) => (
            <div key={item.stage_id} className="stage-card-container">
              <StageCard
                image_url={item.image_url || ""}
                first_dimension_name={item.first_dimension_name || ""}
                second_dimension_name={item.second_dimension_name || ""}
                input_field_1={item.input_field_1}
                input_field_2={item.input_field_2}
                title={item.stage_title || ""}
                buttonClickHandler={() => handleCardClick(item.stage_id)}
                variant="request"
                onFirstFieldChange={(e) =>
                  handleFirstStageFieldChanges(item.stage_id, e)
                }
                onSecondFieldChange={(e) =>
                  handleSecondStageFieldChanges(item.stage_id, e)
                }
              />
              {isDraft && (
                <Button
                  className="stage-delete-button"
                  onClick={() => handleDeleteStage(item.stage_id)}
                >
                  <img
                    className="bin-icon bin-icon-closed"
                    src="/IAD-frontend/closed_bin.png"
                  />
                  <img
                    className="bin-icon bin-icon-opened"
                    src="/IAD-frontend/opened_bin.png"
                  />
                </Button>
              )}
            </div>
          ))
        ) : (
          <section className="stages-not-found">
            <h1>К сожалению, пока ничего не найдено :(</h1>
          </section>
        )}
        <div className="buttons-panel">
          <Button
            className="save-button"
            onClick={handleRequestSave}
            disabled={isSaving}
          >
            {isSaving ? "Сохранение..." : "Сохранить"}
          </Button>

          <Button
            className="cancel-button"
            onClick={handleCancelChanges}
            variant="outline-secondary"
            disabled={isSaving || !hasChanges}
          >
            Отменить изменения
          </Button>
          {isDraft && (
            <>
              <Button
                className="form-button"
                onClick={handleFormRequest}
                disabled={isSaving || isForming || hasChanges}
                title={
                  hasChanges
                    ? "Сохраните изменения перед формированием заявки"
                    : "Отправить заявку модератору"
                }
              >
                {isForming ? "Формирование..." : "Сформировать"}
              </Button>
              <Button className="delete-button" onClick={handleDelete}>
                Удалить
              </Button>
            </>
          )}
        </div>
      </div>

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          duration={notification.type === "error" ? 5000 : 3000}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};
