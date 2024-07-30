import React, { useEffect, useState } from 'react'
import request from '../../../utils/request';
import api from '../../../utils/api';
import Pagetitle from '../../../shared/ui/page-title/Pagetitle';

const ReportPermissionManagement = () => {

    const breadcrumbItems = [
        { label: "Home page", path: "/NWF/home-page" },
        {
            label: "Permission Report Management",
            path: "/report/permission-report",
            active: true,
        },
    ];

    // Variable search
    const [searchForm, setSearchForm] = useState();
    const [roleCode, setRoleCode] = useState();
    const [roleName, setRoleName] = useState();
    const [isCollapsed, setIsCollapsed] = useState(true);


    const [listRole, setListRole] = useState([]);
    const [permissionRole, setPermissionRole] = useState();
    const [parentPermissionList, setParentPermissionList] = useState([]);
    const [listPer, setListPer] = useState([]);
    const [parentPermissionListTemp, setParentPermissionListTemp] = useState([]);


    useEffect(() => {
        initForm();
    }, []);

    useEffect(() => {
        const searchForm = {
            roleCode,
            roleName,
        };

        setSearchForm(searchForm);
    }, [roleCode, roleName]);

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

    const search = (form) => {
        const json = {
            code: form?.roleCode,
            name: form?.roleName,
            page: 1,
            limit: 10,
        };

        request
            .post(api.GET_ROLE_BY_CONDITION, json)
            .then((res) => {
                setListRole(res.data);
            })
            .catch((err) => console.log(err));
    };


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
            setParentPermissionList(JSON.parse(JSON.stringify(parentPermissionListTemp)));
        });
    }

    return (
        <div className="container-fluid">
            <Pagetitle breadcrumbItems={breadcrumbItems} title={"Quản lí phân quyền"}></Pagetitle>
            <div className="row">
                <div className="col-12 card-box">
                    <fieldset>
                        <legend className="m-cursor">
                            <a
                                onClick={() => {
                                    setIsCollapsed(!isCollapsed);
                                }}>
                                Tìm kiếm thông tin
                                <i aria-hidden="true" className={(isCollapsed ? "fas fa-minus" : "fas fa-plus") + " ml-1"}></i>
                            </a>
                        </legend>
                    </fieldset>
                </div>
            </div>
        </div>
    )
}

export default ReportPermissionManagement