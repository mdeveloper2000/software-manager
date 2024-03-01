const { createApp, ref } = Vue
const { useToast } = primevue.usetoast
const { useConfirm } = primevue.useconfirm

const App = {
    
    setup() {
        const mask = ref('****-****-****-****')        
        const masks = ref(['****-****-****-****', '***-***-***'])
        const showNew = ref(false)
        const showEdit = ref(false)
        const hasErrors = ref(false)
        const hasEditErrors = ref(false)
        const softwares = ref([])
        const nome = ref('')
        const nome_edit = ref('')
        const chave = ref('')
        const chave_edit = ref('')
        const id = ref(0)
        const toast = useToast()        
        const confirm = useConfirm()

        return {
            mask, masks, showNew, hasErrors, hasEditErrors, softwares, nome, nome_edit, chave, chave_edit, id, 
            toast, showEdit, id, confirm
        }
    },
    components: {
        "p-button": primevue.button,
        "p-message": primevue.message,
        "p-dialog": primevue.dialog,
        "p-inputtext": primevue.inputtext,
        "p-column": primevue.column,
        "p-datatable": primevue.datatable,
        "p-toast": primevue.toast,
        "p-panel": primevue.panel,
        "p-dropdown": primevue.dropdown,
        "p-confirmdialog": primevue.confirmdialog,
        "p-inputmask": primevue.inputmask
    },    
    methods: {
        save() {
            if(this.nome.trim() === '' || this.chave.trim() === '') {
                this.hasErrors = true
            }
            else {
                const storage = localStorage.getItem("softwares")
                let index = 1
                if(storage !== null) {                    
                    index = JSON.parse(storage).length + 1
                }
                const software = {
                    id: index,
                    nome: this.nome,
                    mask: this.mask,
                    chave: this.chave
                }
                this.softwares.push(software)
                localStorage.setItem("softwares", JSON.stringify(this.softwares))
                this.toast.add({ severity: "success", summary: "Mensagem", detail: "Software registrado com sucesso", life: 3000 })
                this.clearNewFields()
            }
        },
        edit(id) {
            this.showEdit = true
            const softwareEdit = this.softwares.find((software) => software.id === id)
            this.id = id
            this.mask = softwareEdit.mask
            this.nome_edit = softwareEdit.nome
            this.chave_edit = softwareEdit.chave            
        },
        update() {
            if(this.nome_edit.trim() === '' || this.chave_edit.trim() === '') {
                this.hasEditErrors = true
            }
            else {
                this.softwares.map(software => {
                    if(software.id === this.id) {
                        software.nome = this.nome_edit
                        software.mask = this.mask
                        software.chave = this.chave_edit
                        localStorage.setItem("softwares", JSON.stringify(this.softwares))
                        this.showEdit = false
                        this.toast.add({ severity: "info", summary: "Mensagem", detail: "Software atualizado com sucesso", life: 3000 })
                        this.clearEditFields()
                    }
                })
            }
        },
        clearNewFields() {
            this.nome = ''
            this.chave = ''
            this.hasErrors = false
            this.showNew = false
        },
        clearEditFields() {
            this.id = 0
            this.nome_edit = ''
            this.chave_edit = ''
            this.hasEditErrors = false
            this.showEdit = false
        },
        deleteRow(id) {
            this.confirm.require({
                message: 'Deseja realmente deletar esse registro?',
                header: 'Deletar Software',
                icon: 'pi pi-info-circle',
                rejectLabel: 'Cancelar',
                acceptLabel: 'Deletar',
                rejectClass: 'p-button-secondary p-button-outlined',
                acceptClass: 'p-button-danger',
                accept: () => {
                    this.softwares = this.softwares.filter(software => software.id !== id)
                    localStorage.setItem("softwares", JSON.stringify(this.softwares))
                    this.toast.add({ severity: "error", summary: "Mensagem", detail: "Software deletado com sucesso", life: 3000 })
                },
                reject: () => {
                }
            })
        }
    },
    mounted() {
        const storage = localStorage.getItem("softwares")
        if(storage !== null) {
            this.softwares = JSON.parse(storage)
        }
    }
}

createApp(App)
    .use(primevue.config.default)
    .use(primevue.toastservice)
    .use(primevue.confirmationservice)
    .mount("#app")