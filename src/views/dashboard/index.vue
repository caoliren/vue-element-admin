<template>
    <div class="dashboard-container">
        <!-- <component :is="currentRole" /> -->
        <div v-for="item in list" :key="item.id" class="dash-item" @click="toPage(item.link)">
            <img class="dash-item__img" :src="item.url" />
            <p class="dash-item__img">{{ item.title }}</p>
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex"
import adminDashboard from "./admin"
import editorDashboard from "./editor"
import img1 from "@/assets/icon/icon_today.png"
import img2 from "@/assets/icon/icon_add.png"
import img3 from "@/assets/icon/icon_assign.png"
import img4 from "@/assets/icon/icon_history.png"

export default {
    name: "Dashboard",
    components: { adminDashboard, editorDashboard },
    data() {
        return {
            currentRole: "adminDashboard",
            list: [
                {
                    id: 1,
                    url: img1,
                    link: "/today/index",
                    title: "今日工单",
                },
                {
                    id: 2,
                    url: img2,
                    link: "/order/insert",
                    title: "工单录入",
                },
                {
                    id: 3,
                    url: img3,
                    link: "/assign/index",
                    title: "分配管理",
                },
                {
                    id: 4,
                    url: img4,
                    link: "/export/index",
                    title: "出货历史",
                },
            ],
        }
    },
    computed: {
        ...mapGetters(["roles"]),
    },
    created() {
        if (!this.roles.includes("admin")) {
            this.currentRole = "editorDashboard"
        }
    },
    methods: {
        toPage(url) {
            this.$router.push(url)
        },
    },
}
</script>
<style lang="scss">
.dashboard-container {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    width: 500px;
    margin: 0 auto;
    text-align: center;
}
.dash-item {
    width: 200px;
    height: 240px;
    margin-top: 50px;

    .dash-item__img {
        display: block;
        height: 200px;
    }
    .dash-item__title {
        height: 40px;
        line-height: 40px;
        font-size: 16px;
    }
}
</style>
