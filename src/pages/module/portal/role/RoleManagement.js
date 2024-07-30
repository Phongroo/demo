import React, { useEffect, useState } from "react";
import { checkPermission, getLabelByIdInArray, ListPage, Toast, TypeToast } from "../../../../utils/app.util";
import request from "../../../../utils/request";
import api from "../../../../utils/api";
import Pagetitle from "../../../../shared/ui/page-title/Pagetitle";
import { Form } from "reactstrap";
import RoleManagementAction from "./RoleManagementAction";
import Pagination from "react-js-pagination";
import InputComponent from "../../../../shared/component/input/InputComponent";
import { CREATE, UPDATE } from "../../../../constants/permissionTypes";

const RoleManagement = () => {
	const breadcrumbItems = [
		{ label: "Home page", path: "/NWF/home-page" },
		{ label: "Role Management", path: "/NWF/administration/role-management", active: true },
	];

	const [isCollapsed, setIsCollapsed] = useState(true);
	const [mode, setMode] = useState("TABLE");

	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);

	const [totalRecords, setTotalRecords] = useState(0);

	const [list, setList] = useState([]);

	const [listPage, setListPage] = useState(ListPage);
	const [item, setItem] = useState();

	// form
	const [searchForm, setSearchForm] = useState();
	const [name, setName] = useState();
	const [code, setCode] = useState();

	// action
	const [type, setType] = useState();

	const language = "vi";

	useEffect(() => {
		initForm();
	}, []);

	useEffect(() => {
		const searchForm = {
			code,
			name,
		};
		setSearchForm(searchForm);
	}, [code, name]);

	const initForm = (isReset = false) => {
		const form = {
			...searchForm,
		};

		if (isReset) {
			setCode("");
			setName("");
			// setLimit(4);

			form.code = "";
			form.name = "";
		}

		search(form);
	};

	function onPageChange(pageNum) {
		setPage(pageNum);
		getAllByCondition(pageNum, limit,searchForm);
	}

	function changeLimit() {
		getAllByCondition();
	}

	function onUpdate(item) {
		setMode("ACTION");
		setItem(item);
	}

	const search = (form) => {
		setLimit(10);
		setPage(1);
		getAllByCondition(1, 10, form);
	};

	const getAllByCondition = (pageNum = page, pageSize = limit, values) => {
		setLoading(true);

		const json = {
			code: values?.code,
			name: values?.name,
			page: pageNum,
			limit: pageSize,
		};
		console.log("json", json);

		request.post(api.GET_ROLE_BY_CONDITION, json).then((res) => {
			setLoading(false);
			if (res && res.data) {
				setList(res.data);
				setTotalRecords(res.totalRecord);
			} else if (res.errorCode === "1") {
				Toast(res.errorDesc, TypeToast.ERROR);
			} else {
				Toast("Get data failed", TypeToast.ERROR);
			}
		});
	};

	return (
		<div className="container-fluid">
			<Pagetitle breadcrumbItems={breadcrumbItems} title={"Quản lý vai trò"}></Pagetitle>
			{mode === "TABLE" ? (
				<div className="row">
					<div className="col-12 card-box">
						<fieldset>
							<legend>
								<a
									onClick={() => {
										setIsCollapsed(!isCollapsed);
									}}>
									Tìm kiếm thông tin
									<i aria-hidden="true" className={(isCollapsed ? "fas fa-minus" : "fas fa-plus") + " ml-1"}></i>
								</a>
							</legend>

							{isCollapsed && (
								<Form>
									<div className="row mb-2">
										<div className="col-4">
											<InputComponent title={"Mã vai trò"} name="code" value={code} onChange={(val) => setCode(val)}></InputComponent>
										</div>
										<div className="col-4">
											<InputComponent title={"Tên vai trò"} name="name" value={name} onChange={(val) => setName(val)}></InputComponent>
										</div>
									</div>
									<div className="row">
										<div className="col-6">
											<button
												hidden={!checkPermission(CREATE)}
												onClick={() => {
													setMode("ACTION");
												}}
												className="btn btn-primary"
												type="button">
												<i className="fas fa-plus mr-1"></i>
												<span className="text-button">Tạo mới</span>
											</button>
										</div>
										<div className="col-6 text-right">
											<button onClick={() => initForm(true)} className="btn btn-secondary" type="button">
												<i className="fas fa-undo-alt mr-1"></i>
												<span className="text-button">Làm mới</span>
											</button>
											<button onClick={() => search(searchForm)} className="btn btn-primary ml-1" type="button">
												<i className="fas fa-search mr-1"></i>
												<span className="text-button">Tìm kiếm</span>
											</button>
										</div>
									</div>
								</Form>
							)}
						</fieldset>

						<div className="col-12 border-bottom-dotted pb-0 p-0 mb-2 mt-3">
							<span className="font-weight-medium theme-color">Danh sách vai trò</span>
						</div>

						<div className="table-responsive">
							<table className="table table-bordered table-sm table-hover m-w-tabble">
								<thead>
									<tr className="m-header-table">
										<th className="text-center align-middle">STT</th>
										<th className="text-center align-middle mw-100">Mã</th>
										<th className="text-center align-middle mw-200">Tên vài trò</th>
										<th className="text-center align-middle">Xem tất cả</th>
										<th className="text-center align-middle mw-100">Thao tác</th>
									</tr>
								</thead>

								<tbody>
									{(!list || list.length <= 0) && (
										<tr>
											<td className="text-center align-middle" colSpan="10">
												Không có dữ liệu
											</td>
										</tr>
									)}
									{list?.map((item, i) => {
										return (
											<tr key={item?.id}>
												<td className="text-center align-middle">{limit * (page - 1) + i + 1}</td>
												<td className="align-middle">{item?.code}</td>
												<td className="align-middle">{item?.name}</td>
												<td className="align-middle text-center">
													{item?.viewAll ? <i class="fas fa-check-circle text-success"></i> : <i class="fas fa-times-circle text-danger"></i>}
												</td>
												<td className="align-middle text-center">
													<span hidden={!checkPermission(UPDATE)} onClick={() => onUpdate(item)} className="text-info m-cursor">
														<i className="fas fa-pencil-alt"></i>
													</span>
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
						<div className="float-right">
							<Pagination
								itemClass="page-item"
								linkClass="page-link"
								activePage={page}
								itemsCountPerPage={limit}
								totalItemsCount={totalRecords}
								pageRangeDisplayed={5}
								onChange={(pageNum) => onPageChange(pageNum)}
							/>
						</div>
					</div>
				</div>
			) : (
				<RoleManagementAction
					item={item}
					passEntry={(res) => {
						initForm(true);
						getAllByCondition();
						setMode("TABLE");
						setItem(null);
					}}></RoleManagementAction>
			)}
		</div>
	);
};

export default RoleManagement;
