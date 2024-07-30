import React, { useEffect, useState } from "react";
import Pagetitle from "../../../../shared/ui/page-title/Pagetitle";
import request from "../../../../utils/request";
import api from "../../../../utils/api";

import Pagination from "react-js-pagination";
import { Form } from "reactstrap";
import InputComponent from "../../../../shared/component/input/InputComponent";
import SelectComponent from "../../../../shared/component/select/SelectComponent";
import MoneyTypeAction from "./MoneyTypeAction";

const MoneyType = () => {
	const breadcrumbItems = [
		{ label: "Home page", path: "/NWF/home-page" },
		{ label: "Money type", path: "/NWF/category/money-type", active: true },
	];

	const [isCollapsed, setIsCollapsed] = useState(true);
	const [limit, setLimit] = useState(10);
	const [page, setPage] = useState(1);

	const [moneyTypeList, setMoneyTypeList] = useState([]);
	const [mode, setMode] = useState("TABLE");
	const [totalRecords, setTotalRecords] = useState(0);

	// search
	const [searchForm, setSearchForm] = useState();
	const [code, setCode] = useState("");
	const [name, setName] = useState("");
	const [status, setStatus] = useState("");

	// action
	const [item, setItem] = useState();
	const [type, setType] = useState();

	useEffect(() => {
		initForm();
	}, []);

	const getForm = () => {
		return {
			code,
			name,
			status,
		};
	};

	// initForm
	useEffect(() => {
		const searchForm = getForm();

		setSearchForm(searchForm);
	}, [code, name, status]);

	const initForm = (isReset = false) => {
		const form = searchForm
			? {
					...searchForm,
			  }
			: getForm();
		if (isReset) {
			setName("");
			setCode("");
			setStatus("");

			form.code = "";
			form.name = "";
			form.status = "";
		}
		search(form);
	};

	const reset = () => {
		setLimit(10);
		setPage(1);
		initForm(true);
	};

	function getMoneyType(page, limit, form = {}) {
		const payload = {
			limit,
			page,
			...form,
		};
		request
			.post(api.GET_MONEY_TYPE, payload)
			.then((res) => {
				if (res?.errorCode === "OK") {
					setMoneyTypeList(res?.data);
					setTotalRecords(res.totalRecord);
				} else {
					setMoneyTypeList([]);
				}
			})
			.catch((e) => setMoneyTypeList([]));
	}

	const search = (form) => {
		setLimit(10);
		setPage(1);
		getMoneyType(page, limit, form);
	};

	function onUpdate(type, item) {
		setMode("ACTION");
		setType(type);
		setItem(item);
	}

	function onPageChange(page) {
		setPage(page);
		getMoneyType(page, limit, searchForm);
	}

	const formatDate = (day) => {
		const date = new Date(day);
		return date.toLocaleDateString("en-US");
	};

	return (
		<div class="container-fluid mt-2">
			<Pagetitle breadcrumbItems={breadcrumbItems} title={"Quản lý loại tiền"}></Pagetitle>
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
										<div className="col-4">
											<InputComponent title={"Mã loại tiền"} name="code" value={code} onChange={(val) => setCode(val)}></InputComponent>
										</div>

										<div className="col-4">
											<InputComponent title={"Tên loại tiền"} name="name" value={name} onChange={(val) => setName(val)} maxLength={3}></InputComponent>
										</div>
										<div className="col-4">
											<SelectComponent
												notFirstDefault
												name={"status"}
												title={"Trạng thái"}
												list={[
													{ value: "", label: "Tất cả" },
													{ value: "Y", label: "Hoạt động" },
													{ value: "N", label: "Không hoạt động" },
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
							<span className="font-weight-medium theme-color">Danh sách loại tiền</span>
						</div>

						<div className="table-responsive">
							<table className="table table-bordered table-sm table-hover m-w-tabble">
								<thead>
									<tr className="m-header-table">
										<th className="text-center align-middle mw-150">Mã loại tiền</th>
										<th className="text-center align-middle mw-200">Tên loại tiền(VN)</th>
										<th className="text-center align-middle mw-200">Tên loại tiền(EN)</th>
										<th className="text-center align-middle mw-300">Ghi chú</th>
										<th className="text-center align-middle mw-200">Trạng thái</th>
										<th className="text-center align-middle mw-100">Thao tác</th>
									</tr>
								</thead>

								<tbody>
									{(!moneyTypeList || moneyTypeList.length <= 0) && (
										<tr>
											<td className="text-center align-middle" colSpan="10">
												Không có dữ liệu
											</td>
										</tr>
									)}
									{moneyTypeList?.map((item, i) => {
										return (
											<tr key={item?.id}>
												<td className="align-middle text-center text-primary m-cursor" onClick={() => onUpdate("view", item)}>
													<span>{item.code}</span>
												</td>
												<td className="align-middle">{item?.name}</td>
												<td className="align-middle">{item?.nameEn}</td>
												<td className="align-middle">{item?.note}</td>
												<td className="align-middle text-center">{item?.status === "Y" ? "Hoạt động" : "Không hoạt động"}</td>
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
				<MoneyTypeAction
					item={item}
					type={type}
					passEntry={(res) => {
						initForm(true);
						setMode("TABLE");
						setItem(null);
					}}></MoneyTypeAction>
			)}
		</div>
	);
};

export default MoneyType;
