import Pagetitle from "../../../../shared/ui/page-title/Pagetitle";
import React, { useEffect, useState } from "react";

import "../../../../assets/scss/custom/my-camunda.scss";
import { CustomBPMN } from "../custom/app";
import { from } from "rxjs";
import { Toast } from "../../../../utils/app.util";
import ProcessService from "../../../../shared/service/ProcessService";
import Swal from "sweetalert2";

const HIGH_PRIORITY = 1500;
window.addEventListener("click", (event) => {
  if (document.getElementById("quality-assurance")) {
    document.getElementById("quality-assurance").classList.add("hidden");
  }
});

const CreateProcess = (props) => {
  const breadcrumbItems = [
    { label: "Home page", path: "/NWF/home-page" },
    {
      label: "Process Management",
      path: "/NWF/administration/menu-management",
      active: true,
    },
    {
      label: "Tạo mới quy trình",
      path: "/NWF/administration/menu-management",
      active: true,
    },
  ];

  const [loading, setLoading] = useState(false);
  const [processId, setProcessId] = useState();
  const [bpmnModeler, setBpmnModeler] = useState();
  const [fileName, setFileName] = useState();
  const [taskName, setTaskName] = useState();
  const [processCode, setProcessCode] = useState();

  const [xmlData, setXmlData] = useState();

  // Service
  const processService = new ProcessService();

  useEffect(() => {
    initBpmn();

    // Trường hợp lấy thông tin quy trình từ detail
    const processIdFromUrl = props?.location?.state?.processId;
    if (processIdFromUrl) {
      readProcessByProcessId(processIdFromUrl);
    } else {
      importDefaultBpmn();
    }
  }, []);

  // Khi giá trị của xmlData thay đổi thì chạy đoạn này
  useEffect(() => {
    importXML(xmlData);
  }, [xmlData]);

  function initBpmn() {
    const bpmnModeler = CustomBPMN(
      document.getElementById("container"),
      document.getElementById("js-properties-panel")
    );
    setBpmnModeler(bpmnModeler);
  }

  function readProcessByProcessId(processId) {
    processService
      .getResources(processId)
      .then((res2) => {
        if (res2?.length > 0) {
          setProcessId(processId);
          processService.getDataXML(processId, res2[0]?.id).then((res) => {
            setXmlData(res);
          });
        }
      })
      .catch((err) => null);
  }

  function importDefaultBpmn() {
    const defaultProcessURL = require("../resources/diagram.bpmn");
    fetch(defaultProcessURL)
      .then((response) => response.text())
      .then((xmlData) => {
        setXmlData(xmlData);
        setFileName("default_file");
      });
  }

  function uploadTemplateFile(event) {
    const fileBPMN = event.target.files[0];

    setFileName(fileBPMN.name);
    readFiles(fileBPMN);
  }

  function readFiles(file) {
    //Change file => set processId = null;
    setProcessId(null);

    let reader = new FileReader();
    reader.onload = () => {
      setXmlData(reader.result);
    };
    reader.readAsText(file);
  }

  function importXML(diagramXML) {
    bpmnModeler?.importXML(diagramXML)?.then(() => {
      bpmnModeler.on("element.contextmenu", HIGH_PRIORITY, (event) => {
        event.originalEvent.preventDefault();
        event.originalEvent.stopPropagation();
        if (event.element != null && event.element.businessObject.name) {
          setTaskName(event.element.businessObject.name);
          document.getElementById("quality-assurance").classList.remove("hidden");
        }
      });
    });
  }

  function exportDiagram() {
    return from(bpmnModeler?.saveXML({ format: true }));
  }

  function downloadDiagram() {
    exportDiagram().subscribe((res) =>
      writeContents(res.xml, "diagram.bpmn", "application/xml")
    );
  }

  function writeContents(content, fileName, contentType) {
    const a = document.createElement("a");
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
  }

  function zoomIn() {
    bpmnModeler.get("zoomScroll").stepZoom(1);
  }

  function zoomOut() {
    bpmnModeler.get("zoomScroll").stepZoom(-1);
  }

  function saveProcess() {
    Swal.fire({
      title: "Lưu quy trình?",
      text: "Vui lòng nhập tên quy trình!",
      input: "text",
      inputAttributes: {
        autocapitalize: "off",
      },
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Lưu",
      inputValidator: (value) => {
        if (!value) {
          return "Bạn cần nhập tên quy trình!";
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        confirmSave(result?.value);
      }
    });
  }

  function confirmSave(processName) {
    // Get list task to save config
    const elementRegistry = bpmnModeler.get("elementRegistry");
    const listTask = [];

    console.log('elementRegistry', elementRegistry);
    elementRegistry.forEach((element) => {
      // if(element?.type === "bpmn:SequenceFlow") {
      //   console.log("flow", element);
      // }
      if (element.type === "bpmn:Task" || element.type === "bpmn:UserTask") {
        console.log("UserTask", element.incoming);
        const json = {
          stepId: element.businessObject.id,
          stepName: element.businessObject.name,
        };
        listTask.push(json);
      }
    });

    if (!listTask || listTask?.length < 1) {
      Toast("Không thấy được danh sách task");
      return;
    }

    // const proName = removeVietNameCharacter(processName);
    const json = {
      processId: null,
      processCode: processCode,
      processName: processName,
      status: "A",
      stepRequests: listTask,
    };

    const source = "ACB-NWF";
    setLoading(true);

    exportDiagram().subscribe((res) => {
      let node = new DOMParser().parseFromString(
        res.xml,
        "text/xml"
      ).documentElement;
      let nodes = node.querySelectorAll("*");
      for (let item of nodes) {
        if (
          item.tagName?.toLocaleUpperCase() ===
          "bpmn2:process"?.toLocaleUpperCase()
        ) {
          setProcessCode(item?.id);
        }
      }
      const file = new Blob([res.xml], { type: "application/xml" });

      // Deploy process
      processService.deployProcess(processName, source, file).then((res) => {
        if (res) {
          if (res?.deployedProcessDefinitions) {
            const values = Object.values(res?.deployedProcessDefinitions);

            json.processKey = values[0]?.key;
            json.processDefinitionId = values[0]?.id;
            json.processId = res.id;
            json.oldProcessId = processId;

            // Lưu thông tin quy trình vào db
            processService.insertProcess(json).then((rs) => {
              setLoading(false);
              if (rs?.errorCode === "0") {
                Toast("Lưu quy trình thành công");

                setProcessId(null);
                setFileName(null);
                initBpmn();
              } else {
                Toast(rs.errorDesc);
              }
            });
          } else {
            setLoading(false);
            Toast("Lưu quy trình thất bại");
          }
        } else {
          setLoading(false);
          Toast("Lưu quy trình thất bại");
        }
      });
    });
  }

  return (
    <div className="container-fluid">
      <Pagetitle
        breadcrumbItems={breadcrumbItems}
        title={"Thêm mới quy trình"}
      ></Pagetitle>

      <div className="row">
        {/* <div className="col-12 card-box">
          
        </div> */}
        <div className="col-12">
          <div className="card-box">
            <div className="row border-bottom-dotted">
              <div className="col-2">
                <div className="input-group">
                  <div className="input-group-append">
                    <label htmlFor="upload">
                      <span className="btn-upload-file">
                        <i className="fas fa-cloud-upload-alt mr-1"></i>
                        Chọn tệp tin
                      </span>
                      <input
                        accept="text/bpmn"
                        onChange={(event) => uploadTemplateFile(event)}
                        onClick={(event) => (event.target.value = null)}
                        type="file"
                        style={{ display: "none" }}
                        id="upload"
                      />
                    </label>
                  </div>
                </div>
                <span className="pt-1 ml-1">{fileName}</span>
              </div>
              <div className="col-8">
                {/* hidden={!fileName && !processId} */}
                <button onClick={() => { props.history?.push("/bpmn/list-process", {}) }}
                  className="btn btn-sm btn-outline-secondary" type="button"  hidden={!processId}>
                  <i className="fas fa-arrow-left"></i>
                  <span className="text-button ml-1">Tới cấu hình</span>
                </button>
                <button type="button"
                  className="btn btn-primary btn-sm mr-1 ml-1"
                  onClick={() => saveProcess()}>
                  <i className="fas fa-save"></i> Save
                </button>
                <button type="button"
                  className="btn btn-primary btn-sm mr-1t"
                  onClick={() => downloadDiagram()}>
                  <i className="fas fa-cloud-download-alt"></i> Export Process
                </button>
                

              </div>
            </div>

            <div className="row canvas">
              <div className="canvas-inner" id="container">
                <a className="custom-btn zoom" onClick={() => zoomIn()}>
                  <i className="fas fa-search-plus"></i>
                </a>
                <a className="custom-btn zoom-out" onClick={() => zoomOut()}>
                  <i className="fas fa-search-minus"></i>
                </a>
              </div>
              <div className="properties-panel-parent" id="js-properties-panel"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProcess;
