import request from "../../utils/request";
import {
	URL_CAMUDA_SERVICE
} from "../../utils/proxy";
import api from "../../utils/api";

export default class ProcessService {

	// Camunda REST API
	deployProcess(
		name,
		source,
		fileToUpload
	) {
		const formData = new FormData();
		formData.append('deployment-name', name);
		formData.append('deployment-source', source);
		formData.append('enable-duplicate-filtering', 'true');
		formData.append('fileKey', fileToUpload, name + '.bpmn');

		const endpoint = `${URL_CAMUDA_SERVICE}deployment/create`;
		return request.postFormData(endpoint, formData);
	}

	getResources(id) {
		const endpoint = `${URL_CAMUDA_SERVICE}deployment/${id}/resources`;
		return request.get(endpoint);
	}

	getDataXML(id, resourceId) {
		const endpoint = `${URL_CAMUDA_SERVICE}deployment/${id}/resources/${resourceId}/data`;
		return request.getReturnText(endpoint);
	}

	getBpmnXmlById(id) {
		const endpoint = `${URL_CAMUDA_SERVICE}process-definition/${id}/xml`;
		return request.get(endpoint);
	}

	getActiveTask(processInstanceId) {
		const endpoint = `${URL_CAMUDA_SERVICE}task?processInstanceId=${processInstanceId}&active=true`;
		return request.get(endpoint);
	}

	getProcessStatisticsById(processDefinitionId) {
		// const params = {'incidents': 'true'};
		const endpoint = `${URL_CAMUDA_SERVICE}process-definition/${processDefinitionId}/statistics?incidents=true`;
		return request.get(endpoint);
	}

	// Local API
	insertProcess(json) {
		return request.post(api.INSERT_PROCESS, json);
	}

}