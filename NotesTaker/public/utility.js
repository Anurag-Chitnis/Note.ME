class Utility {
    constructor() {
        this.root = document.documentElement;
        this.SelectorObject =  {
            currentDate: document.querySelectorAll('.deletedIdea'),
            permanent_class: document.querySelectorAll(".permanent_class"),
            hearts: document.querySelectorAll('#hearts'),
            box_image: document.querySelectorAll("#box_image"),
            undo_idea: document.querySelectorAll("#undo_idea"),
            permanent_delete: document.querySelectorAll('#permanent-delete'),
            admin_delete: document.querySelectorAll('#admin_delete'),
            form: document.querySelector("#image_selector"),
            images: document.querySelectorAll(".edit_image"),
        }
    }

    DarkMode() {
        this.root.style.setProperty('--main-background-color', "#27293D")
        this.root.style.setProperty('--card-color', '#27293D')
        this.root.style.setProperty('--alpha-channel', "rgba(10,10,10,.8)")
        this.root.style.setProperty('--main-font-color', '#ddd')
        this.root.style.setProperty('--divider', '#8c87f5')
        this.root.style.setProperty('--navigation-color-primary', '#40d0bc')
        this.root.style.setProperty('--navigation-color-secondary', '#3273dc')
        this.root.style.setProperty('--preloader--primary', "#27293D")
        this.root.style.setProperty('--preloader--secondary', "#27293D")
    }
    
    LightMode(){
        this.root.style.setProperty('--main-background-color', '#fff')
        this.root.style.setProperty('--card-color', '#fff')
        this.root.style.setProperty('--alpha-channel', "rgba(10,10,10,.1)")
        this.root.style.setProperty('--main-font-color', '#333')
        this.root.style.setProperty('--divider', '#fdefef')
        this.root.style.setProperty('--navigation-color-primary', '#ec008c')
        this.root.style.setProperty('--navigation-color-secondary', '#fc6767')
        this.root.style.setProperty('--preloader--primary', "#ec008c")
        this.root.style.setProperty('--preloader--secondary', "#fc6767")
    }

    messageBox(object){
        object.elementArray.forEach(element => {
            element.addEventListener('submit', (e) => {
                e.preventDefault();
                Swal.fire({
                    title: object.title,
                    text: object.text,
                    icon: object.messageType,
                    confirmButtonText: object.buttonText,
                })
                .then(confirmed => {
                    if (confirmed) {
                        element.submit();
                    }else {
                        e.preventDefault();
                    }
                })
            })
        })
    }

    diff_hours(dt2, dt1){
        var diff =(dt2.getTime() - dt1.getTime()) / 1000;
        diff /= (60 * 60);
        return Math.abs(Math.round(diff));
    }

}
// Preloader code
// window.addEventListener('load', () => {
//     document.querySelector('.pageloader').style.display = "block";
//     setTimeout(function() {
//         document.querySelector('.pageloader').style.display = "none";
//     },2000)
// })
