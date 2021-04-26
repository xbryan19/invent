import { mapState, mapMutations } from 'vuex'
const myPlugins = {
    install(Vue){
        Vue.mixin({
            data: () => ({
                url: process.env.VUE_APP_URL

            }),
            created(){
                this.$notification.config({
                    placement: "bottomRight",
                    duration: 3,
                });
            },
            computed: {
                ...mapState([
                    'userInfo', 
                    'unRegister'
                ])
            },
            methods: {
                ...mapMutations([
                    'CHANGE_USER_INFO',
                    'GETUNREGISTER'
                ])
            },
        })
    }
}
 
export default myPlugins