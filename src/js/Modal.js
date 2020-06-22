Modal = function() {


}

Modal.prototype.changeTo = function(e) {
    let _active = document.querySelector('.modal>div.active')
    _active.classList.remove('active');

    let _content = document.getElementById('content-'+e.id);
    _content.classList.add('active');

}
// 
// Modal.prototype.applyLocale = function() {
//     // Modal
//     let _content = document.querySelector('.modal>div.active');
//     if (!_content) return;
//
//     switch (_content.id) {
//     case 'content-over':
//         let _spans = _content.querySelectorAll('span');
//         _spans.forEach(_span => {
//             _span.innerHTML = _span.innerHTML.replace('$groet', 'Hallo');
//             _span.innerHTML = _span.innerHTML.replace('$leeftijd', '21');
//         });
//         break;
//     case 'content-projecten':
//         break;
//     case 'content-contact':
//         break;
//     }
//
// }



module.exports = Modal;
