import request from "@/utils/request"

export function findTodayList(data) {
    return request({
        url: "/today/findTodayList",
        method: "post",
        data,
    })
}

export function searchToday(data) {
    return request({
        url: "/today/searchToday",
        method: "post",
        data,
    })
}

export function find(data) {
    return request({
        url: "/order/find",
        method: "post",
        data,
    })
}

export function findStatHistory(data) {
    return request({
        url: "/stat/findStatHistory",
        method: "post",
        data,
    })
}

export function findAssignList(data) {
    return request({
        url: "/assign/findAssignList",
        method: "post",
        data,
    })
}

export function findExportList(data) {
    return request({
        url: "/export/findExportList",
        method: "post",
        data,
    })
}

export function findAssign(data) {
    return request({
        url: "/assign/findAssign",
        method: "post",
        data,
    })
}

export function findTuogong(data) {
    return request({
        url: "/order/findTuogong",
        method: "post",
        data,
    })
}

export function findExport(data) {
    return request({
        url: "/export/findExport",
        method: "post",
        data,
    })
}

export function insert(data) {
    return request({
        url: "/order/insertGongdan",
        method: "post",
        data,
    })
}

export function insertAssignOrder(data) {
    return request({
        url: "/assign/insertAssignOrder",
        method: "post",
        data,
    })
}

export function insertExportOrder(data) {
    return request({
        url: "/export/insertExportOrder",
        method: "post",
        data,
    })
}

export function search(data) {
    return request({
        url: "/order/search",
        method: "post",
        data,
    })
}

export function searchAssign(data) {
    return request({
        url: "/assign/searchAssign",
        method: "post",
        data,
    })
}

export function searchExport(data) {
    return request({
        url: "/export/searchExport",
        method: "post",
        data,
    })
}

export function deleteTuogong(data) {
    return request({
        url: "/order/delete",
        method: "post",
        data,
    })
}

export function deleteAssign(data) {
    return request({
        url: "/assign/deleteAssign",
        method: "post",
        data,
    })
}

export function update(data) {
    return request({
        url: "/order/update",
        method: "post",
        data,
    })
}

export function updateAssign(data) {
    return request({
        url: "/assign/updateAssign",
        method: "post",
        data,
    })
}

export function stat(data) {
    return request({
        url: "/stat/stat",
        method: "post",
        data,
    })
}

export function statForStatus(data) {
    return request({
        url: "/stat/statForStatus",
        method: "post",
        data,
    })
}

export function statList(data) {
    return request({
        url: "/stat/statList",
        method: "post",
        data,
    })
}
