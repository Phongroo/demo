import React, { useEffect, useState } from "react";
import Pagetitle from "../../../../shared/ui/page-title/Pagetitle";
import request from "../../../../utils/request";
import api from "../../../../utils/api";

import BranchManagementAction from "./BranchManagementAction";
import Pagination from "react-js-pagination";
import { Form } from "reactstrap";
import InputComponent from "../../../../shared/component/input/InputComponent";
import SelectComponent from "../../../../shared/component/select/SelectComponent";
import { getLabelByIdInArray } from "../../../../utils/app.util";

const BranchManagement = () => {
	const breadcrumbItems = [
		{ label: "Home page", path: "/NWF/home-page" },
		{ label: "Branch Management", path: "/NWF/administration/branch-management", active: true },
	];

	const [isCollapsed, setIsCollapsed] = useState(true);
	const [limit, setLimit] = useState(10);
	const [page, setPage] = useState(1);

	const [listBranch, setListBranch] = useState([]);
	const [listBranchParent, setListBranchParent] = useState([]);
	const [mode, setMode] = useState("TABLE");
	const [totalRecords, setTotalRecords] = useState(0);

	// search
	const [searchForm, setSearchForm] = useState();
	const [code, setCode] = useState("");
	const [branchName, setBranchName] = useState("");
	const [branchNameEn, setBranchNameEn] = useState("");
	const [status, setStatus] = useState(-1);

	// action
	const [item, setItem] = useState();
	const [type, setType] = useState();

	useEffect(() => {
		initForm();
		getListBrachParent();
	}, []);

	const getForm = () => {
		return {
			code,
			branchName,
			branchNameEn,
			status,
		};
	};

	// initForm
	useEffect(() => {
		const searchForm = getForm();

		setSearchForm(searchForm);
	}, [code, branchName, branchNameEn, status]);

	const getListBrachParent = () => {
		request
			.post(api.GET_LIST_BRANCH_PARENT, {})
			.then((res) => {
				if (res?.errorCode === "1") {
					setListBranchParent(res?.data);
				} else {
					setListBranchParent([]);
				}
			})
			.catch((e) => setListBranchParent([]));
	};

	const initForm = (isReset = false) => {
		const form = searchForm
			? {
					...searchForm,
			  }
			: getForm();
		console.log("initForm", form);
		if (isReset) {
			setBranchName("");
			setCode("");
			setBranchNameEn("");
			setStatus(-1);

			form.code = "";
			form.branchName = "";
			form.branchNameEn = "";
			form.status = -1;
		}
		search(form);
	};

	const reset = () => {
		setLimit(10);
		setPage(1);
		initForm(true);
	};

	function getListBranch(page, limit, form = {}) {
		const payload = {
			limit,
			page,
			...form,
		};
		request
			.post(api.GET_LIST_BRANCH, payload)
			.then((res) => {
				if (res?.errorCode === "1") {
					setListBranch(res?.data);
					setTotalRecords(res.totalRecord);
				} else {
					setListBranch([]);
				}
			})
			.catch((e) => setListBranch([]));
	}

	const search = (form) => {
		setLimit(10);
		setPage(1);
		getListBranch(page, limit, form);
	};

	function onUpdate(type, item) {
		setMode("ACTION");
		setType(type);
		setItem(item);
	}

	function onPageChange(page) {
		setPage(page);
		getListBranch(page, limit, searchForm);
	}

	const formatDate = (day) => {
		const date = new Date(day);
		return date.toLocaleDateString("en-US");
	};

	return (
		<div class="container-fluid mt-2">
			<Pagetitle breadcrumbItems={breadcrumbItems} title={"Quản lý chi nhánh"}></Pagetitle>
			{mode === "TABLE" ? (
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
										<div className="col-6">
											<InputComponent title={"Mã chi nhánh"} name="code" value={code} onChange={(val) => setCode(val)}></InputComponent>
										</div>

										<div className="col-6">
											<InputComponent
												title={"Tên chi nhánh(VN)"}
												name="branchName"
												value={branchName}
												onChange={(val) => setBranchName(val)}></InputComponent>
										</div>
										<div className="col-6">
											<InputComponent
												title={"Tên chi nhánh(EN)"}
												name="branchNameEn"
												value={branchNameEn}
												onChange={(val) => setBranchNameEn(val)}></InputComponent>
										</div>
										<div className="col-6">
											<SelectComponent
												notFirstDefault
												name={"status"}
												title={"Trạng thái"}
												list={[
													{ value: -1, label: "Tất cả" },
													{ value: 1, label: "Hoạt động" },
													{ value: 0, label: "Không hoạt động" },
												]}
												bindLabel={"label"}
												bindValue={"value"}
												value={status}
												onChange={(val) => {
													setStatus(val?.value);
												}}></SelectComponent>
										</div>
									</div>

									<div className="row">
										<div className="col-6">
											<button
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
							<span className="font-weight-medium theme-color">Danh sách chi nhánh</span>
						</div>

						<div className="table-responsive">
							<table className="table table-bordered table-sm table-hover m-w-tabble">
								<thead>
									<tr className="m-header-table">
										<th className="text-center align-middle mw-150">Mã Chi Nhánh</th>
										<th className="text-center align-middle mw-200">Tên Chi Nhánh(VN)</th>
										<th className="text-center align-middle mw-200">Tên Chi Nhánh(EN)</th>
										<th className="text-center align-middle mw-300">Địa Chỉ</th>
										<th className="text-center align-middle mw-200">Chi nhánh cha</th>
										<th className="text-center align-middle mw-200">Ngày tạo</th>
										<th className="text-center align-middle mw-200">Trạng thái</th>
										<th className="text-center align-middle mw-100">Thao tác</th>
									</tr>
								</thead>

								<tbody>
									{(!listBranch || listBranch.length <= 0) && (
										<tr>
											<td className="text-center align-middle" colSpan="10">
												Không có dữ liệu
											</td>
										</tr>
									)}
									{listBranch?.map((item, i) => {
										return (
											<tr key={item?.id}>
												<td className="align-middle text-center text-primary m-cursor" onClick={() => onUpdate("view", item)}>
													<span>{item.code}</span>
												</td>
												<td className="align-middle">{item?.branchName}</td>
												<td className="align-middle">{item?.branchNameEn}</td>
												<td className="align-middle">{item?.address}</td>
												<td className="align-middle">{getLabelByIdInArray(item?.parentId, listBranchParent, "code", "branchName")}</td>
												<td className="align-middle">{formatDate(item?.createDate)}</td>
												<td className="align-middle text-center">{item?.status === 1 ? "Hoạt động" : "Không hoạt động"}</td>
												<td className="align-middle text-center">
													<span onClick={() => onUpdate("update", item)} className="text-info m-cursor">
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
				<BranchManagementAction
					listParent={listBranchParent}
					item={item}
					type={type}
					passEntry={(res) => {
						initForm(true);
						setMode("TABLE");
						setItem(null);
					}}></BranchManagementAction>
			)}
		</div>
	);
};
export default BranchManagement;
