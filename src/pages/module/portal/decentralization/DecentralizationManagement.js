import React, { useEffect, useState } from "react";
import Pagetitle from "../../../../shared/ui/page-title/Pagetitle";
import request from "../../../../utils/request";
import api from "../../../../utils/api";
import { Form } from "reactstrap";
import InputComponent from "../../../../shared/component/input/InputComponent";
import { authUser } from "../../../../helpers/authUtils";
import { Toast, TypeToast } from "../../../../utils/app.util";

const DecentralizationManagement = (props) => {
  const breadcrumbItems = [
    { label: "Home page", path: "/NWF/home-page" },
    {
      label: "Decentralization Management",
      path: "/NWF/administration/decentralization-management",
      active: true,
    },
  ];
  const [loading, setLoading] = useState(false);
  const [permissionLoading, setPermissionLoading] = useState(false);

  const [isCollapsed, setIsCollapsed] = useState(true);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [listMenu, setListMenu] = useState([]);
  const [listRole, setListRole] = useState([]);
  const [parentPermissionList, setParentPermissionList] = useState([]);
  const [parentPermissionListTemp, setParentPermissionListTemp] = useState([]);
  const [listPer, setListPer] = useState([]);
  const [permissionRole, setPermissionRole] = useState();
  const [showChildren, setShowChildren] = useState([]);

  // Variable search
  const [searchForm, setSearchForm] = useState();
  const [roleCode, setRoleCode] = useState();
  const [roleName, setRoleName] = useState();

  useEffect(() => {
    fetchMenus();
    initForm();
  }, []);

  // initForm
  useEffect(() => {
    const searchForm = {
      roleCode,
      roleName,
    };

    setSearchForm(searchForm);
  }, [roleCode, roleName]);

  const search = (form) => {
    setLoading(true);
    const json = {
      code: form?.roleCode,
      name: form?.roleName,
      page: 1,
      limit: 100,
    };

    request
      .post(api.GET_ROLE_BY_CONDITION, json)
      .then((res) => {
        setLoading(false);
        setListRole(res.data);
      })
      .catch((err) => setLoading(false));
  };

  function fetchMenus() {
    request.post(api.GET_MENU_BY_CONDITION, {}).then((res) => {
      const menus = res?.data;
      setListMenu(menus);
      if (menus) {
        let parentMenus = menus.filter((el) => !el?.parentId);
        // setParentPermissionList();
        const listTemp = [];
        parentMenus.forEach((el) => {
          listTemp.push(false);
          el.showChildren = false;
          const childrenMenu = menus.filter((c) => c?.parentId === el.id);
          el.childrenMenu = childrenMenu;
        });

        setShowChildren(listTemp);
        // setParentPermissionList(parentMenus);
        setParentPermissionListTemp(parentMenus);
      }
    });
  }

  function getPermissionByRoleCode(item) {
    if (!item) {
      setPermissionRole("");
      setParentPermissionList([]);
      return;
    }

    setPermissionRole(item);
    const payload = {
      roleCode: item?.code,
    };
    setPermissionLoading(true);

    setParentPermissionList([]);
    request.post(api.GET_CONDITION_BY_PERMISSION, payload).then((res) => {
      const listPerTemp = res.data;

      setListPer(listPerTemp);
      // parentPermissionListTemp?.map((el) => {
      //     let permissionMenu = listPerTemp.find((x) => x.menuId === el?.id);
      //     if (permissionMenu) {
      //         if (el?.id === permissionMenu?.menuId) {
      //             el.view = permissionMenu?.view;
      //             el.confirm = permissionMenu?.confirm;
      //             el.create = permissionMenu?.create;
      //             el.delete = permissionMenu?.delete;
      //             el.reject = permissionMenu?.reject;
      //             el.update = permissionMenu?.update;
      //         }
      //     }
      //
      //     return el
      // });
      setParentPermissionList(
        JSON.parse(JSON.stringify(parentPermissionListTemp))
      );
    });
  }

  const initForm = (isReset = false) => {
    const form = {
      ...searchForm,
    };

    if (isReset) {
      setRoleCode("");
      setRoleName("");

      form.roleCode = "";
      form.roleName = "";
      getPermissionByRoleCode(null);
    }

    search(form);
  };

  const pathValueSubmit = (per, el, isChild = false) => {
    let rs = false;
    const old = getPer(per, el, isChild);
    const current = el[per];
    if (old) {
      rs = current === undefined ? old : current;
    } else {
      rs = current;
    }
    return rs ? 1 : 0;
  };

  const mapJsonSubmit = (el, isChild = false) => {
    const user = authUser();

    el.view = pathValueSubmit("view", el, isChild);
    el.confirm = pathValueSubmit("confirm", el, isChild);
    el.create = pathValueSubmit("create", el, isChild);
    el.delete = pathValueSubmit("delete", el, isChild);
    el.reject = pathValueSubmit("reject", el, isChild);
    el.update = pathValueSubmit("update", el, isChild);
    el.roleCode = permissionRole?.code;
    el.creater = user?.id;
    el.editer = user?.id;
    el.menuId = el?.id;

    return el;
  };
  const submit = () => {
    const parentPermissionTemp = JSON.parse(
      JSON.stringify(parentPermissionList)
    );
    const rqLsChild = [];
    const rqLs = parentPermissionTemp?.map((el) => {
      const child = el?.childrenMenu?.map((x) => {
        return mapJsonSubmit(x, true);
      });
      rqLsChild.push(child);
      return mapJsonSubmit(el);
    });
    // const
    const json = {
      requestList: [...rqLs, ...rqLsChild?.flatMap((x) => x)],
    };

    // console.log(rqLs?.map(x => x?.view))
    // console.log(rqLsChild?.flatMap(x => x))
    // console.log(json?.requestList)

    // return
    setLoading(true);
    request
      .post(api.SAVE_PERMISSION, json)
      .then((res) => {
        if (res && res.data > 0) {
          Toast("Update permission success!", TypeToast.SUCCESS);
          initForm(true);
          reloadPermission();
        } else {
          Toast("Update permission failed", TypeToast.ERROR);
        }
      })
      .catch((err) => {
        setLoading(false);
        Toast("Update permission failed", TypeToast.ERROR);
      });
  };

  const reloadPermission = () => {
    localStorage.removeItem("permission");
    request
      .post(api.GET_LIST_MENU, {})
      .then((res) => {
        if (res.hasOwnProperty("data") > 0) {
          localStorage.setItem("permission", JSON.stringify(res?.data));
        }
      })
      .catch((e) => {
        localStorage.removeItem("permission");
      });
  };

  const getPer = (per, x, isChild = false) => {
    const item = JSON.parse(JSON.stringify(x));
    let permissionMenu = listPer.find((z) => z.menuId === item?.id);
    if (isChild) {
      if (permissionMenu) {
        return permissionMenu;
      }
      return item;
    } else {
      if (permissionMenu?.hasOwnProperty(per)) {
        return permissionMenu[per] === 1;
      }
    }

    return false;
  };

  const onCheckOrUncheckAll = (item, checked) => {
    const view = document.getElementById("view" + item?.id);
    const create = document.getElementById("create" + item?.id);
    const update = document.getElementById("update" + item?.id);
    const del = document.getElementById("delete" + item?.id);
    const confirm = document.getElementById("confirm" + item?.id);
    const reject = document.getElementById("reject" + item?.id);

    view.checked = checked;
    create.checked = checked;
    update.checked = checked;
    del.checked = checked;
    confirm.checked = checked;
    reject.checked = checked;

    item.view = checked;
    item.create = checked;
    item.update = checked;
    item.delete = checked;
    item.confirm = checked;
    item.reject = checked;
  };

  const inputCheckRender = (item, per, i) => {
    return (
      <div className="custom-control custom-checkbox text-center align-middle">
        <input
          className="custom-control-input m-cursor"
          id={per + item?.id}
          type="checkbox"
          onChange={(event) => {
            console.log(per, event?.target?.checked);
            item[per] = event?.target?.checked;
          }}
          checked={item[per]}
          defaultChecked={getPer(per, item)}
          // value={item?.view}
        />
        <label
          className="custom-control-label m-cursor"
          htmlFor={per + item?.id}
        ></label>
      </div>
    );
  };

  const columnRender = (item, i) => {
    return (
      <tr key={i}>
        <td className="align-middle font-weight-500">
          {item?.childrenMenu?.length > 0 && (
            <i
              className={
                !showChildren[i]
                  ? "fas fa-caret-right mr-1 m-cursor"
                  : "fas fa-caret-down mr-1 m-cursor"
              }
              onClick={() => {
                const listTemp = [...showChildren];
                listTemp[i] = !listTemp[i];
                setShowChildren(listTemp);
              }}
            ></i>
          )}
          {item?.name}
        </td>
        <td className="text-center">{inputCheckRender(item, "view", i)}</td>
        <td className="text-center">{inputCheckRender(item, "create", i)}</td>
        <td className="text-center">{inputCheckRender(item, "update", i)}</td>
        <td className="text-center">{inputCheckRender(item, "delete", i)}</td>
        <td className="text-center">{inputCheckRender(item, "confirm", i)}</td>
        <td className="text-center">{inputCheckRender(item, "reject", i)}</td>
        <td className="text-center">
          <span
            title="Chọn tất cả"
            onClick={() => onCheckOrUncheckAll(item, true)}
          >
            <i class="fas fa-check-double text-primary"></i>
          </span>
          <span
            title="Bỏ chọn tất cả"
            class="ml-1"
            onClick={() => onCheckOrUncheckAll(item, false)}
          >
            <i class="fas fa-times fa-lg text-danger"></i>
          </span>
        </td>
      </tr>
    );
  };

  const columnChildRender = (item, i) => {};

  return (
    <div className="container-fluid">
      <Pagetitle
        breadcrumbItems={breadcrumbItems}
        title={"Quản lí phân quyền"}
      ></Pagetitle>
      <div className="row">
        <div className="col-12 card-box">
          <fieldset>
            <legend className="m-cursor">
              <a
                onClick={() => {
                  setIsCollapsed(!isCollapsed);
                }}
              >
                Tìm kiếm thông tin
                <i
                  aria-hidden="true"
                  className={
                    (isCollapsed ? "fas fa-minus" : "fas fa-plus") + " ml-1"
                  }
                ></i>
              </a>
            </legend>
            {isCollapsed && (
              <Form>
                <div className="row">
                  <div className="col-4">
                    <InputComponent
                      title={"Mã vai trò"}
                      name="roleCode"
                      value={roleCode}
                      onChange={(val) => setRoleCode(val)}
                    ></InputComponent>
                  </div>
                  <div className="col-4">
                    <InputComponent
                      title={"Tên vai trò"}
                      name="roleName"
                      value={roleName}
                      onChange={(val) => setRoleName(val)}
                    ></InputComponent>
                  </div>
                  <div className="col-sm-12 col-md-12 col-lg-4 col-xl-4 mt-1">
                    <div className="text-right">
                      <button
                        onClick={() => initForm(true)}
                        className="btn btn-secondary mt-3 mb-0"
                        type="button"
                      >
                        <i className="fas fa-undo-alt mr-1"></i>
                        <span className="text-button">Làm mới</span>
                      </button>
                      <button
                        onClick={() => search(searchForm)}
                        className="btn btn-primary mt-3 ml-1"
                        type="button"
                      >
                        <i className="fas fa-search mr-1"></i>
                        <span className="text-button">Tìm kiếm</span>
                      </button>

                      {permissionRole?.name && (
                        <button
                          onClick={() => submit()}
                          className="btn btn-primary mt-3 ml-1"
                          type="button"
                        >
                          <i className="fas fa-save mr-1"></i>
                          <span className="text-button">Lưu</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </Form>
            )}
          </fieldset>
          <div className="row mt-3">
            <div className="col-md-12 col-sm-12 col-lg-4">
              <div className="mb-1">
                <span style={{ fontWeight: "700" }}>
                  <b>Vai trò</b>
                </span>
              </div>
              <div className="table-responsive">
                <table className="table table-bordered table-sm table-hover m-w-tabble">
                  <thead>
                    <tr className="m-header-table">
                      <th className="text-center align-middle">Mã vai trò</th>
                      <th className="text-center align-middle">Vai trò</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Trường hợp danh sách không có dữ liệu */}
                    {(!listRole || listRole.length <= 0) && (
                      <tr>
                        <td className="text-center align-middle" colSpan={2}>
                          No data
                        </td>
                      </tr>
                    )}

                    {/* Trường hợp danh sách có dữ liệu */}
                    {listRole?.map((item, i) => {
                      return (
                        <tr
                          key={i}
                          onClick={() => {
                            getPermissionByRoleCode(item);
                          }}
                        >
                          <td className="align-middle text-center text-primary m-cursor">
                            {item?.code}
                          </td>
                          <td className="align-middle text-center text-primary m-cursor">
                            {item?.name}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Table phân quyền chi tiết */}
            <div className="col-md-12 col-sm-12 col-lg-8">
              <div className="row mb-1">
                <div className="col-12">
                  Phân quyền cho vai trò:
                  <span className="text-primary">
                    <b> {permissionRole?.name}</b>
                  </span>
                </div>
              </div>
              {!loading && (
                <div className="table-responsive max-height-600">
                  <table className="table table-bordered table-sm table-hover m-w-tabble">
                    <thead>
                      <tr className="m-header-table">
                        <th className="text-center align-middle mw-200">
                          Chức năng
                        </th>
                        <th className="text-center align-middle">Xem</th>
                        <th className="text-center align-middle">Tạo</th>
                        <th className="text-center align-middle">Sửa</th>
                        <th className="text-center align-middle">Xoá</th>
                        <th className="text-center align-middle">Duyệt</th>
                        <th className="text-center align-middle">Từ chối</th>
                        <th className="text-center align-middle">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(!parentPermissionList ||
                        parentPermissionList.length <= 0) && (
                        <tr>
                          <td className="text-center align-middle" colSpan={10}>
                            Vui lòng chọn vai trò cần phân quyền
                          </td>
                        </tr>
                      )}
                      {parentPermissionList?.map((item, i) => {
                        return (
                          <>
                            {columnRender(item, i)}
                            {showChildren[i] &&
                              item?.childrenMenu?.map((child, ic) =>
                                columnRender(child, ic)
                              )}
                          </>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DecentralizationManagement;
// className={(isCollapsed ? 'fas fa-minus' : 'fas fa-plus') + ' ml-1'}></i>
