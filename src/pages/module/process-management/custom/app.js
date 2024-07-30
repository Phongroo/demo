import BpmnModeler from 'bpmn-js/lib/Modeler';
import { BpmnPropertiesPanelModule, BpmnPropertiesProviderModule, CamundaPlatformPropertiesProviderModule } from 'bpmn-js-properties-panel';

import CamundaBpmnModdle from 'camunda-bpmn-moddle/resources/camunda.json'

import CustomRenderer from './CustomRenderer';

import BpmnColorPickerModule from 'bpmn-js-color-picker';

export function CustomBPMN(containerEl, panelEL) {
  // create modeler
  return new BpmnModeler({
    container: containerEl,
    propertiesPanel: {parent: panelEL},
    additionalModules: [
      {
        __init__: [ 'customRenderer' ],
        customRenderer: [ 'type', CustomRenderer ]
      },
      BpmnPropertiesPanelModule,
      BpmnPropertiesProviderModule,
      CamundaPlatformPropertiesProviderModule,
      BpmnColorPickerModule
    ],
    moddleExtensions: {
      camunda: CamundaBpmnModdle
    }
  });
}


