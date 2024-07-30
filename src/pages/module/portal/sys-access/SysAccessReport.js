import React, { useEffect, useState } from "react";
import Pagetitle from "../../../../shared/ui/page-title/Pagetitle";
import request from "../../../../utils/request";
import api from "../../../../utils/api";
import { getLabelByIdInArray, ListPage} from "../../../../utils/app.util";

import Pagination from "react-js-pagination";
import { Form } from "reactstrap";
import InputComponent from "../../../../shared/component/input/InputComponent";
import SelectComponent from "../../../../shared/component/select/SelectComponent";
import { downloadFile, createFileType } from "../../../../utils/exportFile";
import {Toast, TypeToast} from "../../../../utils/app.util";

const SysAccessReport = () => {
	const breadcrumbItems = [
		{ label: "Home page", path: "/NWF/home-page" },
		{ label: "System Access Report", path: "/NWF/administration/branch-management", active: true },
	];

	const [isCollapsed, setIsCollapsed] = useState(true);
	const [limit, setLimit] = useState(10);
	const [page, setPage] = useState(1);
	const [totalRecords, setTotalRecords] = useState(0);

	const [mode, setMode] = useState("TABLE");
	const [exportTypeFile, setExportTypeFile] = useState("");

	const [listDepartment, setListDepartment] = useState([]);
	const [listBranch, setListBranch] = useState([]);
	const [listSysAccess, setListSysAccess] = useState([]);

	// search
	const [searchForm, setSearchForm] = useState();
	const [user, setUser] = useState("");
	const [brid, setBrid] = useState("");
	const [orgId, setOrgId] = useState("");
	const [unitCode, setUnitCode] = useState("");
	const [fromDate, setFromDate] = useState("");
	const [toDate, setToDate] = useState("");

	useEffect(() => {
		initForm();
		fetchData();
		getSystemAccess(page, limit);
	}, []);

	useEffect(() => {
		const form = {
			user,
			orgId,
			brid,
			fromDate,
			toDate,
		};
		setSearchForm(form);
	}, [user, orgId, brid, fromDate, toDate]);

	const fetchData = async () => {
		const branchApi = request.post(api.GET_LIST_BRANCH, { status: -1 });
		const departmentApi = request.post(api.GET_DEPARTMENT_PAGING, { status: "Y" });

		const [branch, department] = await Promise.all([branchApi, departmentApi]);
		setListBranch(branch.data);
		setListDepartment(department.data);
	};

	const getSystemAccess = (page, limit, form = {}) => {
		const payload = {
			limit,
			page,
			...form,
		};
		request
			.post(api.GET_SYS_ACCESS, payload)
			.then((res) => {
				if (res?.errorCode === "1") {
					setListSysAccess(res.data);
					setTotalRecords(res.totalRecord);
				} else {
					setListSysAccess([]);
				}
			})
			.catch((e) => console.log(e));
	};

	const initForm = (isReset = false) => {
		const form = {
			...searchForm,
		};

		if (isReset) {
			setUser("");
			setOrgId("");
			setBrid("");
			setUnitCode("");
			setFromDate("");
			setToDate("");

			form.user = "";
			form.brid = "";
			form.orgId = "";
			form.unitCode = "";
			form.fromDate = "";
			form.toDate = "";
		}
		search(form);
	};

	const reset = () => {
		setLimit(10);
		setPage(1);
		initForm(true);
	};

	const search = (form) => {
		setLimit(10);
		setPage(1);
		getSystemAccess(page, limit, form);
	};

	function onPageChange(page) {
		setPage(page);
		getSystemAccess(page, limit, searchForm);
	}

	const exportFile = (type) => {
		const payload = {
			exportType: type,
		};
		request.postToExport(api.EXPORT_USER_LOGIN, payload).then(
			(res) => {
				if (res) {
					Toast("Export success",TypeToast.SUCCESS);
					downloadFile(res, createFileType(type), "System_access");
				}
			},
			(error) => {
				Toast("Export fail",TypeToast.ERROR);
			}
		);
	};

	return (
		<div class="container-fluid mt-2">
			<Pagetitle breadcrumbItems={breadcrumbItems} title={"Báo cáo truy cập hệ thống"}></Pagetitle>
			<div class="row">
				<div class="col-12 card-box">
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
										<InputComponent title={"Tài khoản"} name="user" value={user} onChange={(val) => setUser(val)}></InputComponent>
									</div>
									<div className="col-4">
										<SelectComponent
											name={"brid"}
											title={"Chi nhánh"}
											list={listBranch}
											bindLabel={"branchName"}
											bindValue={"code"}
											value={brid}
											onChange={(val) => {
												setBrid(val?.value);
											}}></SelectComponent>
									</div>

									<div className="col-4">
										<SelectComponent
											name={"orgId"}
											title={"Phòng ban"}
											list={listDepartment}
											bindLabel={"code"}
											bindValue={"name"}
											value={orgId}
											onChange={(val) => {
												setOrgId(val?.value);
											}}></SelectComponent>
									</div>

									<div className="col-4">
										<SelectComponent
											name={"unitCode"}
											title={"Đơn vị"}
											list={listDepartment}
											bindLabel={"code"}
											bindValue={"name"}
											value={unitCode}
											onChange={(val) => {
												setUnitCode(val?.value);
											}}></SelectComponent>
									</div>

									<div className="col-4">
										<InputComponent title={"Từ ngày"} name="fromDate" value={fromDate} onChange={(val) => setFromDate(val)} type="date"></InputComponent>
									</div>
									<div className="col-4">
										<InputComponent title={"Đến ngày"} name="toDate" value={toDate} onChange={(val) => setFromDate(val)} type="date"></InputComponent>
									</div>
								</div>

								<div className="row">
									<div className="col-6">
										<button onClick={() => exportFile("pdf")} className="btn btn-info" type="button">
											<i className="fas fa-cloud-download-alt mr-1"></i>
											<span className="text-button">Export PDF</span>
										</button>
										<button onClick={() => exportFile("xlsx")} className="btn btn-warning ml-1" type="button">
											<i className="fas fa-cloud-download-alt mr-1"></i>
											<span className="text-button">Export Excel</span>
										</button>
									</div>
									<div className="col-6 text-right">
										<button onClick={() => reset()} className="btn btn-secondary" type="button">
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
						<span className="font-weight-medium theme-color">Danh sách báo cáo truy cập hệ thống</span>
					</div>

					<div className="table-responsive">
						<table className="table table-bordered table-sm table-hover m-w-tabble">
							<thead>
								<tr className="m-header-table">
									<th className="text-center align-middle mw-150">Tài khoản </th>
									<th className="text-center align-middle mw-200">Phòng ban</th>
									<th className="text-center align-middle mw-200">Thời gian truy cập</th>
									<th className="text-center align-middle mw-200">Trạng thái</th>
									<th className="text-center align-middle mw-200">IP người dùng</th>
									<th className="text-center align-middle mw-200">Loại truy cập</th>
								</tr>
							</thead>

							<tbody>
								{(!listSysAccess || listSysAccess.length <= 0) && (
									<tr>
										<td className="text-center align-middle" colSpan="10">
											Không có dữ liệu
										</td>
									</tr>
								)}
								{listSysAccess?.map((item, i) => {
									return (
										<tr key={item?.id}>
											<td className="align-middle text-center text-primary m-cursor">
												<span>{item.userId}</span>
											</td>
											<td className="align-middle">{getLabelByIdInArray(item?.orgId, listDepartment, "code", "name")}</td>
											<td className="align-middle">{item?.logDate}</td>
											<td className="align-middle">{item?.status === "S" ? "Thành công" : "Thất bại"}</td>
											<td className="align-middle">{item?.ipLog === "N/A" ? "" : item?.ipLog}</td>
											<td className="align-middle text-center">{item?.logType === "I" ? "Login" : "Logout"}</td>
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
		</div>
	);
};

export default SysAccessReport;
