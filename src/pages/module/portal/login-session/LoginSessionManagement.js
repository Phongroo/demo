import React, { useEffect, useState } from "react";
import Pagetitle from "../../../../shared/ui/page-title/Pagetitle";
import request from "../../../../utils/request";
import api from "../../../../utils/api";

import Pagination from "react-js-pagination";
import { Form } from "reactstrap";
import InputComponent from "../../../../shared/component/input/InputComponent";

const LoginSessionManagement = () => {
	const breadcrumbItems = [
		{ label: "Home page", path: "/NWF/home-page" },
		{ label: "Login Session Report", path: "/NWF/administration/login-session", active: true },
	];

	const [isCollapsed, setIsCollapsed] = useState(true);
	const [limit, setLimit] = useState(10);
	const [page, setPage] = useState(1);

	const [listLoginSession, setListLoginSession] = useState([]);
	const [totalRecords, setTotalRecords] = useState(0);

	// search
	const [searchForm, setSearchForm] = useState();
	const [cifCode, setCifCode] = useState("");
	const [fromDate, setFromDate] = useState("");
	const [toDate, setToDate] = useState("");

	useEffect(() => {
		initForm();
		getLoginSession(page, limit);
	}, []);

	// initForm
	useEffect(() => {
		const searchForm = {
			cifCode,
			toDate,
			fromDate,
		};
		setSearchForm(searchForm);
	}, [cifCode, toDate, fromDate]);

	const initForm = (isReset = false) => {
		const form = {
			...searchForm,
		};
		if (isReset) {
			setCifCode("");
			setFromDate("");
			setToDate("");

			form.cifCode = "";
			form.toDate = "";
			form.fromDate = "";
		}
		search(form);
	};

	const reset = () => {
		setLimit(10);
		setPage(1);
		initForm(true);
	};

	function getLoginSession(page, limit, searchForm = {}) {
		const payload = {
			limit,
			page,
			...searchForm,
		};
		request
			.post(api.GET_LOGIN_SESSION, payload)
			.then((res) => {
				if (res?.errorCode === "1") {
					setListLoginSession(res?.data);
					setTotalRecords(res.totalRecord);
				} else {
					setListLoginSession([]);
				}
			})
			.catch((e) => console.log(e));
	}

	const search = (form) => {
		setLimit(10);
		setPage(1);
		getLoginSession(page, limit, form);
	};

	function onPageChange(page) {
		setPage(page);
		getLoginSession(page, limit, searchForm);
	}

	const formatDate = (day) => {
		const date = new Date(day);
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "numeric",
			day: "numeric",
			hour: "numeric",
			minute: "numeric",
			second: "numeric",
		});
	};

	return (
		<div class="container-fluid mt-2">
			<Pagetitle breadcrumbItems={breadcrumbItems} title={"Quản lý phiên đăng nhập"}></Pagetitle>
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
										<InputComponent title={"Mã người dùng"} name="cifCode" value={cifCode} onChange={(val) => setCifCode(val)}></InputComponent>
									</div>
									<div className="col-3">
										<InputComponent title={"Từ ngày"} name="fromDate" value={fromDate} onChange={(val) => setFromDate(val)} type="date"></InputComponent>
									</div>
									<div className="col-3">
										<InputComponent title={"Đến ngày"} name="toDate" value={toDate} onChange={(val) => setToDate(val)} type="date"></InputComponent>
									</div>
								</div>

								<div className="row">
									<div className="col-6"></div>
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
						{/* <span className="font-weight-medium theme-color">Danh sách báo cáo truy cập hệ thống</span> */}
					</div>

					<div className="table-responsive">
						<table className="table table-bordered table-sm table-hover m-w-tabble">
							<thead>
								<tr className="m-header-table">
									<th className="text-center align-middle mw-200">Họ và tên</th>
									<th className="text-center align-middle mw-150">Mã người dùng</th>
									<th className="text-center align-middle mw-200">SessionID/TokenID</th>
									<th className="text-center align-middle mw-400">Thông tin trình duyệt</th>
									<th className="text-center align-middle mw-200">Ngày đăng nhập</th>
								</tr>
							</thead>

							<tbody>
								{(!listLoginSession || listLoginSession.length <= 0) && (
									<tr>
										<td className="text-center align-middle" colSpan="10">
											Không có dữ liệu
										</td>
									</tr>
								)}
								{listLoginSession?.map((item, i) => {
									return (
										<tr key={i}>
											<td className="align-middle">
												<span>{item.fullName}</span>
											</td>
											<td className="align-middle text-center">{item?.cifCode}</td>
											<td className="align-middle">{item?.tokenId}</td>
											<td className="align-middle">{item?.userAgent}</td>
											<td className="align-middle">{formatDate(item?.createdDate)}</td>
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

export default LoginSessionManagement;
