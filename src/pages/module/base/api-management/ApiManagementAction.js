import { Button, Form } from "reactstrap";
import InputComponent from "../../../../shared/component/input/InputComponent";
import SelectComponent from "../../../../shared/component/select/SelectComponent";
import { useEffect, useState } from "react";
import request from "../../../../utils/request";
import TabBar from "../../../../shared/component/tabbar/tabBar";
import api from "../../../../utils/api";
import { Toast, TypeToast } from "../../../../utils/app.util";

const APIManagementAction = () => {
  //   const [endpointType, setEndpointType] = useState();
  //   const [requetType, setRequetType] = useState();
  //   const [methodType, setMethodType] = useState();
  //   const [apiName, setApiName] = useState();
  //   const [apiEndpoint, setApiEndpoint] = useState();
  //   const [loading, setLoading] = useState(false);

  //   const [xmlBody, setXmlBody] = useState();
  //   const [hiddenBody, setHiddenBody] = useState(true);
  //   const [listMappingField, setListMappingField] = useState([]);

  //   const [items, setItems] = useState([
  //     { key: "Content-Type", value: "application/json" },
  //   ]);

  //   const [inputs, setInputs] = useState([
  //     { keyBody: "", dataTypeBody: "", valueBody: "" },
  //   ]);

  //   const handleAddInputBody = () => {
  //     setInputs([...inputs, { keyBody: "", dataTypeBody: "", valueBody: "" }]);
  //   };

  //   const handleInputChangeBody = (index, name, value) => {
  //     const newInputs = [...inputs];
  //     newInputs[index][name] = value;
  //     setInputs(newInputs);
  //   };

  //   const handleAddItem = () => {
  //     setItems([...items, { key: "", value: "" }]);
  //   };

  //   const handleInputChange = (index, key, value) => {
  //     const newItems = [...items];
  //     newItems[index] = { ...newItems[index], [key]: value };
  //     setItems(newItems);
  //   };

  //   const handleRemoveItem = (index) => {
  //     const newItems = [...items];
  //     newItems.splice(index, 1);
  //     setItems(newItems);
  //   };

  //   const handleAddItemMap = (key, value) => {
  //     setListMappingField([...listMappingField, { key: key, value: value }]);
  //   };

  //   const handleInputChangeMap = (index, key, value) => {
  //     const newItems = [...listMappingField];
  //     newItems[index] = { ...newItems[index], [key]: value };
  //     setListMappingField(newItems);
  //   };

  //   const handleRemoveItemMap = (index) => {
  //     const newItems = [...listMappingField];
  //     newItems.splice(index, 1);
  //     setListMappingField(newItems);
  //   };

  //   function createAPIRequest() {
  //     const formData = new FormData();
  //     let body;
  //     let responseType;
  //   }

  //   const sendRequest = async () => {
  //     const data = {
  //       endpointType,
  //       requetType,
  //       methodType,
  //       apiName,
  //       apiEndpoint,
  //       headers: items,
  //       body: inputs,
  //       xmlBody: xmlBody,
  //     };

  //     console.log("data", data);
  //   };

  //   const tabs = [
  //     {
  //       title: "Header",
  //       content: (
  //         <div>
  //           {items.map((item, index) => (
  //             <div className="row" key={index}>
  //               <div className="col-4">
  //                 <InputComponent
  //                   title={"Key"}
  //                   name="key"
  //                   value={item.key}
  //                   onChange={(val) => handleInputChange(index, "key", val)}
  //                 />
  //               </div>
  //               <div className="col-4">
  //                 <InputComponent
  //                   title={"Value"}
  //                   name="value"
  //                   value={item.value}
  //                   onChange={(val) => handleInputChange(index, "value", val)}
  //                 />
  //               </div>
  //               <div className="col-1">
  //                 <span onClick={() => handleRemoveItem(index)}>
  //                   <i
  //                     className="fas fa-times-circle"
  //                     style={{ color: "red" }}
  //                   ></i>
  //                 </span>
  //               </div>
  //             </div>
  //           ))}
  //           <button type="button" onClick={handleAddItem}>
  //             Add Item
  //           </button>
  //         </div>
  //       ),
  //     },

  //     {
  //       title: "Body",
  //       content: (
  //         <div>
  //           <div hidden={hiddenBody}>
  //             {inputs.map((input, index) => (
  //               <div className="row" key={index}>
  //                 <div className="col-4">
  //                   <InputComponent
  //                     title={"Key"}
  //                     name="keyBody"
  //                     value={input.keyBody}
  //                     onChange={(val) =>
  //                       handleInputChangeBody(index, "keyBody", val)
  //                     }
  //                   />
  //                 </div>
  //                 <div className="col-4">
  //                   <SelectComponent
  //                     name={"dataTypeBody"}
  //                     title={"Data Type"}
  //                     list={[
  //                       { value: "String", name: "String", nameEn: "String" },
  //                       { value: "Number", name: "Number", nameEn: "Number" },
  //                       { value: "Boolean", name: "Boolean", nameEn: "Boolean" },
  //                     ]}
  //                     bindLabel={"name"}
  //                     bindValue={"value"}
  //                     value={input.dataTypeBody}
  //                     onChange={(val) =>
  //                       handleInputChangeBody(index, "dataTypeBody", val?.value)
  //                     }
  //                   />
  //                 </div>
  //                 <div className="col-4">
  //                   <InputComponent
  //                     title={"Value"}
  //                     name="valueBody"
  //                     value={input.valueBody}
  //                     onChange={(val) =>
  //                       handleInputChangeBody(index, "valueBody", val)
  //                     }
  //                   />
  //                 </div>
  //               </div>
  //             ))}
  //             <button type="button" onClick={handleAddInputBody}>
  //               Add Input
  //             </button>
  //           </div>
  //           <div className="row">
  //             <div className="col-12">
  //               <InputComponent
  //                 title={"XML Body"}
  //                 name="xmlBody"
  //                 value={xmlBody}
  //                 onChange={(val) => setXmlBody(val)}
  //               />
  //             </div>
  //           </div>
  //         </div>
  //       ),
  //     },
  //   ];

  //   const tabs2 = [
  //     {
  //       title: "Mappping Field",
  //       content: (
  //         <div>
  //           {listMappingField.map((item, index) => (
  //             <div className="row" key={index}>
  //               <div className="col-4">
  //                 <InputComponent
  //                   title={"Key"}
  //                   name="key"
  //                   value={item.key}
  //                   onChange={(val) => handleInputChangeMap(index, "key", val)}
  //                 />
  //               </div>
  //               <div className="col-4">
  //                 <InputComponent
  //                   title={"Value"}
  //                   name="value"
  //                   value={item.value}
  //                   onChange={(val) => handleInputChangeMap(index, "value", val)}
  //                 />
  //               </div>
  //               <div className="col-1">
  //                 <span onClick={() => handleRemoveItemMap(index)}>
  //                   <i
  //                     className="fas fa-times-circle"
  //                     style={{ color: "red" }}
  //                   ></i>
  //                 </span>
  //               </div>
  //             </div>
  //           ))}
  //           <button
  //             type="button"
  //             onClick={() => handleAddItemMap("ErrorCode", "0")}
  //             className="mr-2"
  //           >
  //             ErrorCode : 0
  //           </button>
  //           <button
  //             type="button"
  //             onClick={() => handleAddItemMap("ErrorDesc", "Thành công")}
  //           >
  //             ErrorDesc: Thành công
  //           </button>
  //         </div>
  //       ),
  //     },
  //   ];

  //   const onChangeType = (val) => {
  //     console.log(val);
  //     requetType === "REST" ? setHiddenBody(false) : setHiddenBody(true);
  //     methodType === "POST" ? setHiddenBody(false) : setHiddenBody(true);
  //   };

  //   return (
  //     <div className="container-fluid">
  //       <div className="row">
  //         <div className="col-12 card-box">
  //           <Form>
  //             <div className="row">
  //               <div className="col-4">
  //                 <SelectComponent
  //                   name={"endpointType"}
  //                   title={"Endpoint Type"}
  //                   list={[
  //                     {
  //                       value: "FORM_FIELD",
  //                       name: "FORM_FIELD",
  //                       nameEn: "FORM_FIELD",
  //                     },
  //                     {
  //                       value: "SUBMIT_FORM",
  //                       name: "SUBMIT_FORM",
  //                       nameEn: "SUBMIT_FORM",
  //                     },
  //                   ]}
  //                   bindLabel={"name"}
  //                   bindValue={"value"}
  //                   value={endpointType}
  //                   onChange={(val) => {
  //                     setEndpointType(val?.value);
  //                   }}
  //                 ></SelectComponent>
  //               </div>
  //             </div>

  //             <div className="row">
  //               <div className="col-4">
  //                 <SelectComponent
  //                   name={"requetType"}
  //                   firstRecord={{
  //                     label: "REST",
  //                     value: "REST",
  //                   }}
  //                   title={"Request Type"}
  //                   list={[
  //                     { value: "SOAP", name: "SOAP", nameEn: "SOAP" },
  //                     { value: "OCR", name: "OCR", nameEn: "OCR" },
  //                     { value: "IDCHECK", name: "IDCHECK", nameEn: "IDCHECK" },
  //                     { value: "WSS", name: "WSS", nameEn: "WSS" },
  //                   ]}
  //                   bindLabel={"name"}
  //                   bindValue={"value"}
  //                   value={requetType}
  //                   onChange={(val) => {
  //                     setRequetType(val?.value);
  //                     onChangeType(val?.value);
  //                   }}
  //                 ></SelectComponent>
  //               </div>
  //               <div className="col-4">
  //                 <InputComponent
  //                   title={"API Name"}
  //                   name="apiName"
  //                   value={apiName}
  //                   onChange={(val) => setApiName(val)}
  //                 ></InputComponent>
  //               </div>
  //             </div>
  //             <div className="row">
  //               <div className="col-4">
  //                 <SelectComponent
  //                   name={"methodType"}
  //                   title={"Request Method"}
  //                   firstRecord={{
  //                     label: "GET",
  //                     value: "GET",
  //                   }}
  //                   list={[
  //                     { value: "POST", name: "POST", nameEn: "POST" },
  //                     { value: "WSS", name: "WSS", nameEn: "WSS" },
  //                   ]}
  //                   bindLabel={"name"}
  //                   bindValue={"value"}
  //                   value={methodType}
  //                   onChange={(val) => {
  //                     setMethodType(val?.value);
  //                   }}
  //                 ></SelectComponent>
  //               </div>
  //               <div className="col-4">
  //                 <InputComponent
  //                   title={"API Endpoint"}
  //                   name="apiEndpoint"
  //                   value={apiEndpoint}
  //                   onChange={(val) => setApiEndpoint(val)}
  //                 ></InputComponent>
  //               </div>
  //             </div>
  //             <div className="app">
  //               <TabBar tabs={tabs} />
  //             </div>
  //             <div className="app">
  //               <TabBar tabs={tabs2} />
  //             </div>

  //             <div className="row">
  //               <div className="col-2">
  //                 <button
  //                   class="btn btn-danger mt-1 mr-1"
  //                   onClick={sendRequest}
  //                   type="button"
  //                 >
  //                   <i class="far fa-paper-plane"></i> SEND REQUEST
  //                 </button>
  //               </div>
  //               <div className="col-2">
  //                 <button class="btn btn-success mt-1 mr-1">
  //                   <i class="far fa-save"></i> SAVE API
  //                 </button>
  //               </div>
  //             </div>
  //           </Form>
  //         </div>
  //       </div>
  //     </div>
  //   );

  // ============================ Duy làm =====================================
  const [endpoint, setEndpoint] = useState(null);
  const [xmlBody, setxmlBody] = useState(null);
  const [name, setname] = useState(null);
  const [selectedRequestMethod, setselectedRequestMethod] = useState("GET");
  const [selectedRequestType, setselectedRequestType] = useState("REST");
  const [selectedEndpointType, setselectedEndpointType] =
    useState("FORM_FIELD");
  const endpointTypes = [
    {
      value: "FORM_FIELD",
      label: "FORM_FIELD",
    },
    {
      value: "SUBMIT_FORM",
      label: "SUBMIT_FORM",
    },
  ];
  const requestMethods = [
    { value: "GET", label: "GET" },
    { value: "POST", label: "POST" },
    { value: "WSS", label: "WSS" },
  ];
  const requestTypes = [
    { value: "REST", label: "REST" },
    { value: "SOAP", label: "SOAP" },
    { value: "OCR", label: "OCR" },
    { value: "IDCHECK", label: "IDCHECK" },
    { value: "WSS", label: "WSS" },
  ];
  const availableDataTypes = [
    { value: "String", label: "String" },
    { value: "Number", label: "Number" },
    { value: "Boolean", label: "Boolean" },
  ];
  const [responseData, setresponseData] = useState(null);
  const [responseError, setresponseError] = useState(null);
  const [savedRequestCount, setsavedRequestCount] = useState(null);
  const [requestBody, setrequestBody] = useState([
    { key: "", value: "", type: "" },
  ]);
  const [requestBodyDataTypes, setrequestBodyDataTypes] = useState([""]);
  const [requestHeaders, setrequestHeaders] = useState([
    { key: "Content-Type", value: "application/json" },
  ]);
  const [responseMappings, setresponseMappings] = useState([]);
  const [endpointError, setendpointError] = useState("");
  const [loadingState, setloadingState] = useState(false);
  const [fileUpload, setfileUpload] = useState(null);
  const [fileStore, setfileStore] = useState(null);
  const [requestMode, setrequestMode] = useState(null);

  useEffect(() => {}, []);

  function removeItem(index, ctx) {
    let context;
    if (ctx === "Body") {
      context = requestBody;
    } else if (ctx === "Headers") {
      context = requestHeaders;
    } else if (ctx === "Mapping") {
      context = responseMappings;
    }

    context.splice(index, 1);
    const arrTemp = JSON.parse(JSON.stringify(context));
    if (ctx === "Body") {
      setrequestBody(arrTemp);
    } else if (ctx === "Headers") {
      setrequestHeaders(arrTemp);
    } else if (ctx === "Mapping") {
      setresponseMappings(arrTemp);
    }
  }

  const isAddDisabled = (ctx) => {
    let context;
    if (ctx === "Body") {
      context = requestBody;
    } else if (ctx === "Headers") {
      context = JSON.parse(JSON.stringify(requestHeaders));
    }

    if (context.length > 0) {
      if (
        context[context.length - 1].key === "" ||
        context[context.length - 1].value === ""
      ) {
        return true;
      }
    }

    return false;
  };

  function addItem(ctx) {
    let context;
    if (ctx === "Body") {
      context = JSON.parse(JSON.stringify(requestBody));
    } else if (ctx === "Headers") {
      context = JSON.parse(JSON.stringify(requestHeaders));
    }

    context.push({ key: "", value: "" });
    const arrTemp = JSON.parse(JSON.stringify(context));
    if (ctx === "Body") {
      //   const arrTemp = requestBody;
      //   arrTemp.push("");
      setrequestBody(arrTemp);
    } else if (ctx === "Headers") {
      setrequestHeaders(arrTemp);
    } else if (ctx === "Mapping") {
      setresponseMappings(arrTemp);
    }
  }

  const getValue = (item, index, field, value, ctx) => {
    const item2 = JSON.parse(JSON.stringify(item));
    item2[field] = value;
    if (ctx === "Headers") {
      const arrTemp = JSON.parse(JSON.stringify(requestHeaders));
      arrTemp[index] = item2;
      setrequestHeaders(arrTemp);
    } else if (ctx === "Body") {
      const arrTemp = JSON.parse(JSON.stringify(requestBody));
      arrTemp[index] = item2;
      setrequestBody(arrTemp);
      console.log(arrTemp);
    }
  };

 const constructObject = (ctx) => {
    let context;
    if (ctx === 'Body') {
        context = JSON.parse(JSON.stringify(requestBody));
    } else if (ctx === 'Headers') {
        context = JSON.parse(JSON.stringify(requestHeaders));

    }

    let constructedObject = {};
    constructedObject
        = context
        .reduce((object, item) => {
            object[item.key] = item.value;
            return object;
        }, {});
    return constructedObject;
}

  function sendRequest() {
    setendpointError("");
    setresponseData("");
    setresponseError("");
    if (!endpoint) {
      setendpointError("Endpoint is a Required value");
      return;
    }
    requestBody.forEach((item, index) => {
        if(requestBodyDataTypes[index] === 'Number') {
            item = Number(item);
        }
    });
    setloadingState(true);
    switch(selectedRequestType){
        case 'GET': {
            const headers = constructObject('Headers');
            const payload = {
                url: endpoint,
                method: selectedRequestMethod,
                type: selectedRequestType,
                name: name,
                header: JSON.stringify(headers)
            };
            break;
        }
        default:
            break;
    }
  }

  return (
    <>
      <div className="container-fluid">
        <div className="card-box">
          <div className="row">
            <div className="col-12">
              <SelectComponent
                notFirstDefault
                name={"selectedEndpointType"}
                title={"Endpoint Type"}
                list={endpointTypes}
                bindLabel={"label"}
                bindValue={"value"}
                value={selectedEndpointType}
                onChange={(val) => {
                  setselectedEndpointType(val?.value);
                }}
              ></SelectComponent>
            </div>
            <div className="col-4">
              <SelectComponent
                notFirstDefault
                name={"selectedRequestType"}
                title={"Request Type"}
                list={requestTypes}
                bindLabel={"label"}
                bindValue={"value"}
                value={selectedRequestType}
                onChange={(val) => {
                  setselectedRequestType(val?.value);
                }}
              ></SelectComponent>
            </div>
            <div className="col-8">
              <InputComponent
                name="name"
                value={name}
                title="API Name"
                type="url"
                onChange={(val) => setname(val)}
              ></InputComponent>
            </div>
            <div className="col-4">
              <SelectComponent
                notFirstDefault
                name={"selectedRequestMethod"}
                title={"Request Method"}
                list={requestMethods}
                bindLabel={"label"}
                bindValue={"value"}
                value={selectedRequestMethod}
                disabled={selectedRequestType === "WSS"}
                onChange={(val) => {
                  setselectedRequestMethod(val?.value);
                }}
              ></SelectComponent>
            </div>
            <div className="col-8">
              <InputComponent
                name="endpoint"
                value={endpoint}
                title="API Endpoint"
                type="url"
                onChange={(val) => setEndpoint(val)}
              ></InputComponent>
            </div>

            {/* Headers */}
            {selectedRequestType !== "WSS" && (
              <>
                <div className="col-6">
                  <div className="alert alert-danger" role="alert">
                    <h4 className="alert-heading">Headers</h4>
                    {requestHeaders?.map((item, i) => {
                      return (
                        <div key={i} className="container-fluid">
                          <div className="row pt-2">
                            <div className="col-5">
                              <InputComponent
                                name={"key" + i}
                                value={item?.key || ""}
                                title="Key"
                                disabled={item.key === "Content-Type"}
                                onChange={(val) => {
                                  getValue(item, i, "key", val, "Headers");
                                }}
                              ></InputComponent>
                            </div>
                            <div className="col-5">
                              <InputComponent
                                name={"value" + i}
                                value={item?.value || ""}
                                title="Value"
                                onChange={(val) => {
                                  getValue(item, i, "value", val, "Headers");
                                }}
                              ></InputComponent>
                            </div>
                            <div class="col-2">
                              <label></label>
                              <Button
                                disabled={
                                  item.key === "Content-Type" &&
                                  selectedRequestType !== "OCR"
                                }
                                className="d-block mx-auto mt-1 btn-danger"
                                onClick={() => {
                                  removeItem(i, "Headers");
                                }}
                              >
                                <i class="far fa-times-circle fa-lg fa-primary"></i>
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div className="col-6">
                      <Button
                        disabled={isAddDisabled("Headers")}
                        className="btn btn-primary mt-1 mr-1"
                        onClick={() => {
                          addItem("Headers");
                        }}
                      >
                        <span>
                          <i class="fas fa-plus mr-1"></i>ADD ITEM
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>
                <div
                  className="col-6"
                  hidden={
                    selectedRequestMethod !== "POST" ||
                    selectedRequestType !== "REST"
                  }
                >
                  <div className="alert alert-danger" role="alert">
                    <h4 className="alert-heading">Body</h4>
                    {requestBody?.map((item, i) => {
                      return (
                        <div key={i} className="container-fluid">
                          <div className="row pt-2">
                            <div className="col-4">
                              <InputComponent
                                name={"key" + i}
                                value={item?.key || ""}
                                title="Key"
                                disabled={item.key === "Content-Type"}
                                onChange={(val) => {
                                  getValue(item, i, "key", val, "Body");
                                }}
                              ></InputComponent>
                            </div>
                            <div className="col-3">
                              <SelectComponent
                                notFirstDefault
                                name={"type" + i}
                                title={"Data Type"}
                                list={availableDataTypes}
                                bindLabel={"label"}
                                bindValue={"value"}
                                value={item?.type || ""}
                                onChange={(val) => {
                                  getValue(item, i, "type", val?.value, "Body");
                                }}
                              ></SelectComponent>
                            </div>
                            <div className="col-4">
                              <InputComponent
                                name={"value" + i}
                                value={item?.value || ""}
                                title="Value"
                                disabled={item.key === "Content-Type"}
                                onChange={(val) => {
                                  getValue(item, i, "value", val, "Body");
                                }}
                              ></InputComponent>
                            </div>
                            <div class="col-1">
                              <label></label>
                              <Button
                                className="d-block mx-auto mt-1 btn-danger"
                                onClick={() => {
                                  removeItem(i, "Body");
                                }}
                              >
                                <i class="far fa-times-circle fa-lg fa-primary"></i>
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div className="col-6">
                      <Button
                        disabled={isAddDisabled("Body")}
                        className="btn btn-primary mt-1 mr-1"
                        onClick={() => {
                          addItem("Body");
                        }}
                      >
                        <span>
                          <i class="fas fa-plus mr-1"></i>ADD ITEM
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default APIManagementAction;
