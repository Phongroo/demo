import React, { useEffect, useState } from "react";

import "../../../assets/scss/custom/process-diagram.scss";
import ProcessService from "../../service/ProcessService";
import { from } from "rxjs";
import { CustomBPMN } from "../../../pages/module/process-management/custom/app";
import * as BpmnNavigatedViewer from 'bpmn-js/dist/bpmn-navigated-viewer.production.min.js';
import * as camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda.json';
import { milisecondToHMS } from "../../../utils/app.util";


const HIGH_PRIORITY = 1500;
window.addEventListener("click", (event) => {
  if (document.getElementById("quality-assurance")) {
    document.getElementById("quality-assurance").classList.add("hidden");
  }
});


const ProcessDiagram = (props) => {
  const { passEntry, processTrackings, processId, processDefinitionId, endEventId, viewTotalActives, formCardType } = props;

  const [loading, setLoading] = useState(false);
  const [bpmnModeler, setBpmnModeler] = useState();
  const [xmlDataAndActiveTask, setXmlDataAndActiveTask] = useState();

  // Service
  const processService = new ProcessService();


  useEffect(() => {
    console.log('props', props);
    initBpmn();
    loadDiagram()
  }, []);

  useEffect(() => {
    importXML(xmlDataAndActiveTask);
  }, [xmlDataAndActiveTask]);

  function initBpmn() {
    const bpmnModeler = CustomBPMN(
      document.getElementById("container"),
      document.getElementById("js-properties-panel")
    );

    setBpmnModeler(bpmnModeler);

  }

  function loadDiagram() {

    // Nếu có processId => View diagram của ticket
    if (processId) {
      processService.getActiveTask(processId).then((res) => {
        console.log('res', res);
        console.log('endEventId', endEventId);
        if (res?.length === 0) {
          highlightAllActiveTask([endEventId]);
        } else {
          const listKey = [];
          for (const element of res) {
            listKey.push(element.taskDefinitionKey);
          }
          highlightAllActiveTask(listKey);
        }
      });
    } else {
      getProcessStatisticsById(null);
    }

  }

  function getProcessStatisticsById() {
    processService.getProcessStatisticsById(processDefinitionId).then(res => {
      if (res) {
        const processInstances = res; //DS các task đang hoạt động và số lượng
        highlightAllActiveTask(processInstances);
      }

    })
  }

  function highlightAllActiveTask(processInstances) {
    processService.getBpmnXmlById(processDefinitionId)
      .then((res) => {
        const xmlDataAndActiveTask = {
          diagramXML: res.bpmn20Xml,
          processInstances
        }
        setXmlDataAndActiveTask(xmlDataAndActiveTask);
      });
  }

  function importXML(xmlDataAndActiveTask) {
    const diagramXML = xmlDataAndActiveTask?.diagramXML;
    const processInstances = xmlDataAndActiveTask?.processInstances;
    bpmnModeler?.importXML(diagramXML).then(res => {
      if (processInstances) {
        const canvas = bpmnModeler?.get('canvas');
        canvas.zoom('fit-viewport');

        //BuaTN => Dùng riêng cho loại DỊCH VỤ THẺ
        if(formCardType === "LOCK_CARD,GET_CARD") {
          const check = !processInstances.includes("Activity_4") && !processInstances.includes("Activity_5") && !processInstances.includes("Event_end");
          if(check) {
            canvas.addMarker("Activity_4", 'highlight');
          }
        }

        // Nếu chỉ muốn xem bước hoạt động hiện tại của ticket
        if (!viewTotalActives) {
          for (let item of processInstances) {
            canvas.addMarker(item, 'highlight');
          }
          if (processTrackings?.length > 0) {
            const overlays = bpmnModeler?.get('overlays');
            processTrackings?.forEach(ptd => {
              if (ptd?.stepId) {
                const html = '<div class="badge badge-secondary badge-on-diagram">' + milisecondToHMS(Number(ptd.sla)) + '</div>'
                overlays.add(ptd?.stepId, { position: { bottom: 0, left: 0 },
                  html: html
                });
              }
            })
          }

        } else {
          // Nếu muốn xem tất cả các ticket đang hoạt động
          if (processInstances) {
            console.log('taskDefinitionKeys', processInstances);

            const overlays = bpmnModeler?.get('overlays');
            // Add badge
            processInstances.forEach(x => {
              const html = '<div class="badge badge-primary badge-on-diagram">' + x?.instances + '</div>'
              overlays.add(x?.id, {
                position: {
                  bottom: 0,
                  left: 0
                },
                html: html
              });
            });
          }
        }

      }
    });
  }

  function zoomIn() {
    bpmnModeler.get('zoomScroll').stepZoom(1, 'fit-viewport');
  }

  function zoomOut() {
    bpmnModeler.get('zoomScroll').stepZoom(-1, 'fit-viewport');
  }


  // HTML
  return (
    <div className="row canvas view-process">
      <div className="canvas-inner" id="container">
        <a className="custom-btn zoom" onClick={() => zoomIn()}>
          <i className="fas fa-search-plus"></i>
        </a>
        <a className="custom-btn zoom-out" onClick={() => zoomOut()}>
          <i className="fas fa-search-minus"></i>
        </a>
      </div>
      {/* <div className="properties-panel-parent" id="js-properties-panel"></div> */}
    </div>
  );
};
export default ProcessDiagram;
