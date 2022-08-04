let sideBar = document.querySelector('.side-bar');
let arrowCollapse = document.querySelector('#logo-name__icon');
arrowCollapse.onclick = () => {
    sideBar.classList.toggle('collapse');
    arrowCollapse.classList.toggle('collapse');
    if (arrowCollapse.classList.contains('collapse')) {
        arrowCollapse.classList = 'bx bx-arrow-from-left logo-name__icon collapse';
        document.querySelector('.container').style.marginLeft = '6.4rem';
    } else {
        arrowCollapse.classList = 'bx bx-arrow-from-right logo-name__icon';
        document.querySelector('.container').style.marginLeft = '23.2rem';
    }
};
