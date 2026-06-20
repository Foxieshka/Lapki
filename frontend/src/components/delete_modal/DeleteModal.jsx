import './DeleteModal.css'

export default function DeleteModal(){
    return (
       <div class="popup popup_type_remove-card">
           <div class="popup__content">
             <button type="button" class="popup__close"></button>
             <h3 class="popup__title">Вы уверены?</h3>
             <form class="popup__form" name="remove-card" novalidate>
               <button
                 type="submit"
                 class="button popup__button"
               >
                 Да
               </button>
              </form>
           </div>
      </div>
    );
}