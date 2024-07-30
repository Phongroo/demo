import React, { useEffect, useState } from "react";

import {
  Button,
  Toast,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import "../../../assets/scss/custom/timeline.scss";
import request from "../../../utils/request";
import api from "../../../utils/api";
import {
  getLabelByIdInArray,
  milisecondToHMS,
  parseDate,
} from "../../../utils/app.util";
import ProcessDiagram from "./ProcessDiagram";

const TimeLine = (props) => {
  const { item, statusDetails } = props;

  const [loading, setLoading] = useState(false);
  const [userList, setUserList] = useState();
  const [trackingList, setTrackingList] = useState();
  const [trackingListDowload, setTrackingListDownload] = useState();

  const [modalViewProcess, setModalViewProcess] = useState(false);
  const toggle = () => setModalViewProcess(!modalViewProcess);

  useEffect(() => {
    console.log("item", item);
    if (item?.ticketId) {
      getProcessTracking();
    }
    getUsers();
  }, []);

  function getUsers() {
    request
      .post(api.SEARCH_USER_COMPACT, {})
      .then((res) => {
        setUserList(res.data);
      })
      .catch((err) => console.log("err", err));
  }

  function getProcessTracking() {
    const json = {
      ticketId: item?.ticketId,
    };
    request
      .post(api.GET_PROCESS_DETAILS, json)
      .then((res) => {
        if (res?.data) {
          setTrackingList(res.data);
        }
      })
      .catch((err) => console.log("err", err));
  }

  function downloadFile(base64Data, fileName) {
    const a = document.createElement("a"); //Create <a>
    a.href = base64Data; //Image Base64 Goes here
    a.download = fileName; //File name Here
    a.click();
  }

  // HTML
  return (
    <div>
      {trackingList?.map((item, i) => {
        return (
          <div
            key={item?.id}
            className="align-items-center position-relative pb-2"
          >
            <div className="row">
              <div className="col-7 d-flex align-items-start justify-content-start">
                {["RECOVERY", "RETURN"].includes(
                  item?.action?.toUpperCase()
                ) && (
                  <i className="fas fa-undo-alt icon-timelime text-warning font-weight-bold mt-1"></i>
                )}
                {["CANCEL", "REJECT"].includes(item?.action?.toUpperCase()) && (
                  <i className="fas fa-ban icon-timelime text-danger font-weight-bold  mt-1"></i>
                )}
                {!["RETURN", "CANCEL", "REJECT", "RECOVERY"].includes(
                  item.action?.toUpperCase()
                ) && (
                  <i className="far fa-check-circle icon-timelime text-success font-weight-bold  mt-1"></i>
                )}

                <div className="d-flex flex-column">
                  <span className="font-weight-bold">
                    <span>{item?.statusName}</span>
                    <span className="ml-1">
                      {item?.sla && (
                        <>
                          - <i className="far fa-clock "></i>{" "}
                          {milisecondToHMS(Number(item.sla))}
                        </>
                      )}
                    </span>
                  </span>
                  {item?.creator && (
                    <div className="flex-column e-name">
                      {item?.creator && item?.creator !== "SYSTEM" ? (
                        <span className="font-weight-bold">
                          {getLabelByIdInArray(
                            item?.creator,
                            userList,
                            "id",
                            "fullName"
                          ) + " - " || "N/A"}
                          {getLabelByIdInArray(
                            item?.creator,
                            userList,
                            "id",
                            "code"
                          )}
                        </span>
                      ) : (
                        <span className="font-weight-bold">
                          {item?.creator}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-5 align-items-center justify-content-end">
                <div className="flex-column text-right">
                  <span className="font-weight-bold">
                    {parseDate(item?.createDate || item?.createTime)}
                  </span>
                </div>
              </div>
              {(item.note || item.additioninfo || item.attachedFile) && (
                <div className="col-12 pl-3">
                  <div
                    className="py-2 pl-2 my-2 ml-2 rounded"
                    style={{ backgroundColor: "#f2f3f7" }}
                  >
                    {item?.note && (
                      <div className="row">
                        <span className="col-12 pb-1">
                          {item?.note ? "Ghi chú: " + item?.note : null}
                        </span>
                      </div>
                    )}
                    {item?.attachedFile && (
                      <div className="row">
                        <div className="col-12 w-break">
                          <span
                            title="Click to download"
                            onClick={() =>
                              downloadFile(
                                item?.attachedFile,
                                item.attachedFileName
                              )
                            }
                          >
                            <i className="far fa-file fa-md"></i>
                            <span className="font-weight-bold ml-1">
                              {item.attachedFileName}
                            </span>
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}

      <div className="row">
        <div className="col-12">
          <button
            className=" w-100 btn-blue-outline align-items-center"
            onClick={toggle}
          >
            <span>Xem quy trình</span>
          </button>
        </div>
      </div>

      <Modal
        isOpen={modalViewProcess}
        toggle={toggle}
        centered
        className={"modal-xlxx"}
      >
        <ModalHeader toggle={toggle}>Thông tin quy trình</ModalHeader>
        <ModalBody>
          <ProcessDiagram
            processTrackings={trackingList}
            processId={item?.processId}
            processDefinitionId={item?.processDefinitionId}
            endEventId={item?.endEventId}
            viewTotalActives={false}
            formCardType={item?.formCardType}
          ></ProcessDiagram>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};
export default TimeLine;
