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
import { dest_root } from "../modules/target_config";

export const StageRequestPage: FC = () => {
  const { id } = useParams();

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      dispatch(getStageRequest(Number(id))).then((result) => {
        if (getStageRequest.fulfilled.match(result)) {
          const stagesData = result.payload.stage_request_to_stages || [];
          setOriginalStages([...stagesData]);
          setOriginalRequestInfo({
            productName: result.payload.product_name,
            createdAt: result.payload.created_at,
          });
          // Инициализируем stageChanges для всех карточек как false
          const initialStageChanges: Record<number, boolean> = {};
          stagesData.forEach((stage) => {
            if (stage.stage_id) {
              initialStageChanges[stage.stage_id] = false;
            }
          });
          setStageChanges(initialStageChanges);
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
  const [savingStages, setSavingStages] = useState<Record<number, boolean>>({});
  const [stageChanges, setStageChanges] = useState<Record<number, boolean>>({});

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
      setStageChanges((prev) => ({ ...prev, [stageId]: true }));
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
      setStageChanges((prev) => ({ ...prev, [stageId]: true }));
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
    // Сбрасываем все флаги изменений карточек
    setStageChanges({});
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
    // Сбрасываем все флаги изменений карточек
    setStageChanges({});
  };

  const handleSaveStage = async (stageId: number | undefined) => {
    if (!stageId || !id) return;

    setSavingStages((prev) => ({ ...prev, [stageId]: true }));
    setNotification(null);

    try {
      const stage = stages.find((s) => s.stage_id === stageId);
      if (!stage) return;

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
            stageId: stageId,
            ...updateData,
          }),
        ).unwrap();
      }

      // Обновляем оригинальные данные для этой карточки
      setOriginalStages((prev) =>
        prev.map((s) => (s.stage_id === stageId ? { ...stage } : s)),
      );

      // Сбрасываем флаг изменений для этой карточки
      setStageChanges((prev) => ({ ...prev, [stageId]: false }));

      setNotification({
        message: `Изменения на карточке "${stage.stage_title}" успешно сохранены!`,
        type: "success",
      });
    } catch (error) {
      console.error("Ошибка при сохранении карточки:", error);
      setNotification({
        message: "Произошла ошибка при сохранении карточки",
        type: "error",
      });
    } finally {
      setSavingStages((prev) => ({ ...prev, [stageId]: false }));
    }
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
        // Удаляем состояния для удаленной карточки
        setSavingStages((prev) => {
          const newState = { ...prev };
          delete newState[stageId];
          return newState;
        });
        setStageChanges((prev) => {
          const newState = { ...prev };
          delete newState[stageId];
          return newState;
        });
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
                <div className="stage-card-buttons">
                  <Button
                    className="stage-save-button"
                    onClick={() => handleSaveStage(item.stage_id)}
                    disabled={
                      savingStages[item.stage_id || 0] ||
                      false ||
                      !stageChanges[item.stage_id || 0]
                    }
                    title={
                      !stageChanges[item.stage_id || 0]
                        ? "Нет изменений для сохранения"
                        : "Сохранить изменения на этой карточке"
                    }
                  >
                    <svg
                      width="35px"
                      height="35px"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke="#CCCCCC"
                        stroke-width="0.192"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M18.1716 1C18.702 1 19.2107 1.21071 19.5858 1.58579L22.4142 4.41421C22.7893 4.78929 23 5.29799 23 5.82843V20C23 21.6569 21.6569 23 20 23H4C2.34315 23 1 21.6569 1 20V4C1 2.34315 2.34315 1 4 1H18.1716ZM4 3C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21L5 21L5 15C5 13.3431 6.34315 12 8 12L16 12C17.6569 12 19 13.3431 19 15V21H20C20.5523 21 21 20.5523 21 20V6.82843C21 6.29799 20.7893 5.78929 20.4142 5.41421L18.5858 3.58579C18.2107 3.21071 17.702 3 17.1716 3H17V5C17 6.65685 15.6569 8 14 8H10C8.34315 8 7 6.65685 7 5V3H4ZM17 21V15C17 14.4477 16.5523 14 16 14L8 14C7.44772 14 7 14.4477 7 15L7 21L17 21ZM9 3H15V5C15 5.55228 14.5523 6 14 6H10C9.44772 6 9 5.55228 9 5V3Z"
                          fill="#0F0F0F"
                        ></path>{" "}
                      </g>
                    </svg>
                  </Button>
                  <Button
                    className="stage-delete-button"
                    onClick={() => handleDeleteStage(item.stage_id)}
                  >
                    <img
                      className="bin-icon bin-icon-closed"
                      src={dest_root + "/closed_bin.png"}
                    />
                    <img
                      className="bin-icon bin-icon-opened"
                      src={dest_root + "/opened_bin.png"}
                    />
                  </Button>
                </div>
              )}
            </div>
          ))
        ) : (
          <section className="stages-not-found">
            <h1>К сожалению, пока ничего не найдено :(</h1>
          </section>
        )}
        {!isDraft && (
          <div className="calculation-result">
            <h2>Результат расчета:</h2>
            <p>{requestInfo?.calculationResult}</p>
          </div>
        )}
        {isDraft && (
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
          </div>
        )}
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
