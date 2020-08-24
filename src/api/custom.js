import request from "@/utils/request"

export function search(data) {
    return request({
        url: "/custom/search",
        method: "post",
        data,
    })
}

export function insert(data) {
    return request({
        url: "/custom/insert",
        method: "post",
        data,
    })
}

export function update(data) {
    return request({
        url: "/custom/update",
        method: "post",
        data,
    })
}

export function find() {
    return request({
        url: "/custom/find",
        method: "get",
    })
}

export function del(data) {
    return request({
        url: "/custom/delete",
        method: "post",
        data,
    })
}

export function insertBranch(data) {
    return request({
        url: "/custom/insertBranch",
        method: "post",
        data,
    })
}

export function updateBranch(data) {
    return request({
        url: "/custom/updateBranch",
        method: "post",
        data,
    })
}

export function findBranch(data) {
    return request({
        url: "/custom/findBranch",
        method: "post",
        data,
    })
}

export function deleteBranch(data) {
    return request({
        url: "/custom/deleteBranch",
        method: "post",
        data,
    })
}

export function insertBrand(data) {
    return request({
        url: "/custom/insertBrand",
        method: "post",
        data,
    })
}

export function updateBrand(data) {
    return request({
        url: "/custom/updateBrand",
        method: "post",
        data,
    })
}

export function findBrand(data) {
    return request({
        url: "/custom/findBrand",
        method: "post",
        data,
    })
}

export function deleteBrand(data) {
    return request({
        url: "/custom/deleteBrand",
        method: "post",
        data,
    })
}

export function findBrandDesc(data) {
    return request({
        url: "/custom/findBrandDesc",
        method: "post",
        data,
    })
}
