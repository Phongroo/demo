import React, { useEffect, useState } from "react";
import Pagetitle from "../../../../shared/ui/page-title/Pagetitle";
import api from "../../../../utils/api";
import { ListPage, Toast, checkPermission, getLabelByIdInArray, TypeToast } from "../../../../utils/app.util";
import request from "../../../../utils/request";
import { Form } from "reactstrap";
import DepartmentAction from "./departmentAction";
import moment from "moment";
import Pagination from "react-js-pagination";
import SelectComponent from "../../../../shared/component/select/SelectComponent";
import InputComponent from "../../../../shared/component/input/InputComponent";
import { CREATE, UPDATE } from "../../../../constants/permissionTypes";

const DepartmentScreen = () => {
	const breadcrumbItems = [
		{ label: "Home page", path: "/NWF/home-page" },
		{ label: "Department", path: "/NWF/administration/Department", active: true },
	];
	const [isCollapsed, setIsCollapsed] = useState(true);
	const [mode, setMode] = useState("TABLE");

	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(5);
	const [totalRecord, setTotalRecord] = useState(0);

	const [listMenu, setListMenu] = useState([]);
	const [listStatus, setListStatus] = useState([
		{ value: "all", name: "Tất cả", nameEn: "All" },
		{ value: "Y", name: "Hoạt động", nameEn: "Actice" },
		{ value: "N", name: "Không hoạt động", nameEn: "Inactive" },
	]);
	const [listPage, setListPage] = useState(ListPage);
	const [item, setItem] = useState();

	// form
	const [searchForm, setSearchForm] = useState();
	const [code, setCode] = useState();
	const [status, setStatus] = useState("");
	const [branchCode, setBranchCode] = useState(null);
	const [transactionOfficeCode, setTransactionOfficeCode] = useState(null);
	const [listTransactionOfficeFilter, setListTransactionOfficeFilter] = useState([]);
	const [listBranch, setListBranch] = useState([]);

	const [listDepartment, setListDepartment] = useState([]);

	const [type, setType] = useState();

	const language = "vi";

	useEffect(() => {
		initForm();
		getListBranch();
		getAllDepartment();

		//getAllByCondition();
	}, []);

	useEffect(() => {
		const searchForm = {
			code,
			status,
			branchCode,
			transactionOfficeCode,
		};

		setSearchForm(searchForm);
	}, [code, status, branchCode, transactionOfficeCode]);

	const initForm = (isReset = false) => {
		const form = {
			...searchForm,
		};

		if (isReset) {
			setCode("");
			setBranchCode(null);
			setStatus("");
			setTransactionOfficeCode(null);
			// setPage(1)
			// setLimit(10)

			form.code = "";
			form.branchCode = null;
			form.status = "";
			form.transactionOfficeCode = null;
		}

		search(form);
		// getAllByCondition(page, limit, searchForm)
	};

	function getAllDepartment() {
		const payload = {
			limit: 0,
		};
		request
			.post(api.GET_DEPARTMENT_PARENT_PAGING, payload)
			.then((res) => {
				setListDepartment(res?.data);
			})
			.catch((e) => console.log(e));
	}

	function getListBranch() {
		const payload = {
			code: String,
			branchName: String,
			branchNameEn: String,
			provinceCode: String,
			status: -1,
			limit,
			page,
		};
		request
			.post(api.GET_LIST_BRANCH, payload)
			.then((res) => {
				if (res?.errorCode === "1") {
					setListBranch(res?.data);
				} else {
					setListBranch([]);
				}
			})
			.catch((e) => console.log(e));
	}

	function onPageChange(pageNum) {
		setPage(pageNum);
		getAllByCondition(pageNum, limit);
	}

	function changeLimit() {
		getAllByCondition();
	}

	function onUpdate(type, item) {
		setMode("ACTION");
		setType(type);
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
			name: null,
			transactionOfficeCode: values?.transactionOfficeCode,
			branchCode: values?.branchCode,
			status: values?.status === "all" ? null : values?.status,
			page: pageNum,
			limit: pageSize,
		};
		console.log(json);
		request
			.post(api.GET_DEPARTMENT_PAGING, json)
			.then((res) => {
				if (res) {
					setLoading(false);
					setListMenu(res.data);
					setTotalRecord(res.totalRecord);
				} else {
					setListMenu([]);
					setTotalRecord(0);
				}
			})
			.catch((err) => setLoading(false));
	};

	return (
		<div className="container-fluid">
			<Pagetitle breadcrumbItems={breadcrumbItems} title={"Quản lý bộ phận"}></Pagetitle>
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
									<div className="row">
										<div className="col-4">
											<InputComponent title={"Mã bộ phận"} name="code" value={code} onChange={(val) => setCode(val)}></InputComponent>
										</div>
										<div className="col-4">
											<SelectComponent
												name={"branchCode"}
												title={"Chi nhánh"}
												list={listBranch}
												bindLabel={"branchName"}
												bindValue={"code"}
												value={branchCode}
												onChange={(val) => {
													setBranchCode(val?.value);
													// search({ branchCode: val?.value });
												}}></SelectComponent>
										</div>
										<div className="col-4">
											<SelectComponent
												notFirstDefault
												name={"status"}
												title={"Trạng thái"}
												list={[
													{ value: "", name: "Tất cả", nameEn: "All" },
													{ value: "Y", name: "Hoạt động", nameEn: "Actice" },
													{ value: "N", name: "Không hoạt động", nameEn: "Inactive" },
												]}
												bindLabel={"name"}
												bindValue={"value"}
												value={status}
												onChange={(val) => {
													setStatus(val?.value);
												}}></SelectComponent>
										</div>
									</div>
									<div className="row">
										<div className="col-4">
											<SelectComponent
												name={"transactionOfficeCode"}
												title={"Đơn vị"}
												list={listTransactionOfficeFilter}
												bindLabel={"nameTransactionOffice"}
												bindValue={"code"}
												value={transactionOfficeCode}
												onChange={(val) => {
													setTransactionOfficeCode(val?.value);
													// search({ branchCode: val?.value });
												}}></SelectComponent>
										</div>
									</div>

									<div className="row mt-2">
										<div className="col-6">
											<button
												disabled={!checkPermission(CREATE)}
												onClick={() => {
													onUpdate("create", item);
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
							<span className="font-weight-medium theme-color">Danh sách bộ phận</span>
						</div>

						<div className="table-responsive">
							<table className="table table-bordered table-sm table-hover m-w-tabble">
								<thead>
									<tr className="m-header-table">
										<th className="text-center align-middle mw-100">Mã bộ phận</th>
										<th className="text-center align-middle mw-150">Tên bộ phận</th>
										<th className="text-center align-middle mw-150">Chi nhánh</th>
										{/* <th className="text-center align-middle mw-100">Đơn vị</th> */}
										<th className="text-center align-middle mw-50">Ngày tạo</th>
										<th className="text-center align-middle mw-50">Trạng thái</th>
										<th className="text-center align-middle mw-50">Thao tác</th>
									</tr>
								</thead>

								<tbody>
									{(!listMenu || listMenu.length <= 0) && (
										<tr>
											<td className="text-center align-middle" colSpan="10">
												Không có dữ liệu
											</td>
										</tr>
									)}
									{listMenu?.map((item, i) => {
										return (
											<tr key={item?.id}>
												<td className="align-middle text-primary m-cursor" onClick={() => onUpdate("view", item)}>
													<span>{item.code}</span>
												</td>
												<td className="align-middle">
													<span>{language === "vi" ? item?.name : item?.nameEn}</span>
												</td>
												<td className="align-middle">
													<span>{item?.branchName}</span>
												</td>

												<td className="align-middle text-center">{item?.createDate ? moment(item?.createDate).format("DD/MM/yyyy HH:mm:ss") : ""}</td>
												<td className="align-middle text-center">
													<span class={item?.status === "Y" ? "badge badge-success" : "badge badge-warning"}>
														{item?.status === "Y" ? "Hoạt động" : "Không hoạt động"}
													</span>
												</td>
												<td className="align-middle text-center">
													{checkPermission(UPDATE) ? (
														<span onClick={() => onUpdate("update", item)} className="text-info m-cursor">
															<i className="fas fa-pencil-alt"></i>
														</span>
													) : null}
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
								totalItemsCount={totalRecord}
								pageRangeDisplayed={5}
								onChange={(pageNum) => onPageChange(pageNum)}
							/>
						</div>
					</div>
				</div>
			) : (
				<DepartmentAction
					listDepartment={listDepartment}
					item={item}
					listMenu={listMenu}
					type={type}
					listBranch={listBranch}
					passEntry={(res) => {
						initForm(true);
						getAllByCondition();
						setMode("TABLE");
						setItem(null);
					}}></DepartmentAction>
			)}
		</div>
	);
};

export default DepartmentScreen;
