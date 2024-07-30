import React from 'react';
import Pagetitle from "../../shared/ui/page-title/Pagetitle";


const DefaultDashboard = (props) => {
    const breadcrumbItems = [
        {label: "Home page", path: "/NWF/home-page"},
        {
            label: "Decentralization Management",
            path: "/NWF/administration/decentralization-management",
            active: true,
        },
    ];

    return (
        <div class="container-fluid">
            <Pagetitle
                breadcrumbItems={breadcrumbItems}
                title={"Dashboard"}
            ></Pagetitle>


            <div class="row">
                <div class="col-lg-8">
                    <div class="card">
                        <div class="card-body">
                            <div class="float-right d-none d-md-inline-block">
                                <div class="btn-group mb-2">
                                    <button type="button" class="btn btn-xs btn-light">Today</button>
                                    <button type="button" class="btn btn-xs btn-secondary">Weekly</button>
                                    <button type="button" class="btn btn-xs btn-light">Monthly</button>
                                </div>
                            </div>
                            <h4 class="header-title">Recent Revenue</h4>

                            <div class="row mt-4 text-center">
                                <div class="col-4">
                                    <p class="text-muted font-15 mb-1 text-truncate">Target</p>
                                    <h4><i class="fe-arrow-down text-danger mr-1"></i>$7.8k</h4>
                                </div>
                                <div class="col-4">
                                    <p class="text-muted font-15 mb-1 text-truncate">Last week</p>
                                    <h4><i class="fe-arrow-up text-success mr-1"></i>$1.4k</h4>
                                </div>
                                <div class="col-4">
                                    <p class="text-muted font-15 mb-1 text-truncate">Last Month</p>
                                    <h4><i class="fe-arrow-down text-danger mr-1"></i>$15k</h4>
                                </div>
                            </div>

                            <div class="mt-2" dir="ltr">
                                {/*    <apx-chart [xaxis]="revenueAreaChart.xaxis" [chart]="revenueAreaChart" [series]="revenueAreaChart.series"*/}
                                {/*    [dataLabels]="revenueAreaChart.dataLabels" [legend]="revenueAreaChart.legend"*/}
                                {/*    [stroke]="revenueAreaChart.stroke" [fill]="revenueAreaChart.fill" [colors]="revenueAreaChart.colors"*/}
                                {/*    [yaxis]="revenueAreaChart.yaxis" [tooltip]="revenueAreaChart.tooltip">*/}
                                {/*</apx-chart>*/}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-lg-4">
                    <div class="card">
                        <div class="card-body">
                            <div class="float-right d-none d-md-inline-block">
                                <div class="btn-group mb-2">
                                    <button type="button" class="btn btn-xs btn-secondary">Today</button>
                                    <button type="button" class="btn btn-xs btn-light">Weekly</button>
                                    <button type="button" class="btn btn-xs btn-light">Monthly</button>
                                </div>
                            </div>
                            <h4 class="header-title">Projections Vs Actuals</h4>
                            <div class="row mt-4 text-center">
                                <div class="col-4">
                                    <p class="text-muted font-15 mb-1 text-truncate">Target</p>
                                    <h4><i class="fe-arrow-down text-danger mr-1"></i>$3.8k</h4>
                                </div>
                                <div class="col-4">
                                    <p class="text-muted font-15 mb-1 text-truncate">Last week</p>
                                    <h4><i class="fe-arrow-up text-success mr-1"></i>$1.1k</h4>
                                </div>
                                <div class="col-4">
                                    <p class="text-muted font-15 mb-1 text-truncate">Last Month</p>
                                    <h4><i class="fe-arrow-down text-danger mr-1"></i>$25k</h4>
                                </div>
                            </div>
                            <div class="mt-3 mb-2" dir="ltr">
                                {/*<apx-chart [chart]="projectionsDonutChart" [series]="projectionsDonutChart.series"*/}
                                {/*[labels]="projectionsDonutChart.labels" [legend]="projectionsDonutChart.legend"*/}
                                {/*[colors]="projectionsDonutChart.colors" [responsive]="projectionsDonutChart.responsive"></apx-chart>*/}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-xl-4">
                    <div class="card-box">
                        <div class="row">
                            <div class="col-6">
                                <div class="avatar-sm bg-primary rounded-circle">
                                    <i class="fe-aperture avatar-title font-22 text-white"></i>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="text-right">
                                    {/*<h3 class="text-dark my-1">$<span [CountTo]="8145" [from]="0" [duration]="1"></span></h3>*/}
                                    <p class="text-muted mb-1 text-truncate">Income Status</p>
                                </div>
                            </div>
                        </div>
                        <div class="mt-4">
                            {/*<apx-chart [chart]="incomeBarChart" [series]="incomeBarChart.series" [tooltip]="incomeBarChart.tooltip"*/}
                            {/*[colors]="incomeBarChart.colors" [dataLabels]="incomeBarChart.dataLabels"*/}
                            {/*[plotOptions]="incomeBarChart.plotOptions"></apx-chart>*/}
                        </div>
                    </div>
                </div>

                <div class="col-xl-4">
                    <div class="card-box">
                        <div class="row">
                            <div class="col-6">
                                <div class="avatar-sm bg-success rounded-circle">
                                    <i class="fe-users avatar-title font-22 text-white"></i>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="text-right">
                                    {/*<h3 class="text-dark my-1"><span [CountTo]="7204" [from]="0" [duration]="1"></span></h3>*/}
                                    <p class="text-muted mb-1 text-truncate">Recent Users</p>
                                </div>
                            </div>
                        </div>
                        <div class="mt-4">
                            {/*<apx-chart [chart]="recentuserAreaChart" [series]="recentuserAreaChart.series"*/}
                            {/*[colors]="recentuserAreaChart.colors" [dataLabels]="recentuserAreaChart.dataLabels"*/}
                            {/*[stroke]="recentuserAreaChart.stroke" [tooltip]="recentuserAreaChart.tooltip">*/}
                            {/*</apx-chart>*/}
                        </div>
                    </div>
                </div>

                <div class="col-xl-4">
                    <div class="card-box">
                        <div class="row">
                            <div class="col-6">
                                <div class="avatar-sm bg-secondary rounded-circle">
                                    <i class="fe-shopping-bag avatar-title font-22 text-white"></i>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="text-right">
                                    {/*<h3 class="text-dark my-1"><span CountTo="367" from="0" duration="1"></span></h3>*/}
                                    <p class="text-muted mb-1 text-truncate">Sales Status</p>
                                </div>
                            </div>
                        </div>

                        <div class="mt-4 text-center">
                            {/*<apx-chart [chart]="salesStatusChart" [series]="salesStatusChart.series" [colors]="salesStatusChart.colors"*/}
                            {/*[dataLabels]="salesStatusChart.dataLabels" [stroke]="salesStatusChart.stroke"*/}
                            {/*[tooltip]="salesStatusChart.tooltip">*/}
                            {/*</apx-chart>*/}
                        </div>
                    </div>
                </div>
            </div>
        </div>


    )

}
export default DefaultDashboard;
