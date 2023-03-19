// GENERATE USER PDF
function generateUserPdf(){
    const Userpdf = document.querySelector('#info_card')
    html2pdf()
    .from(Userpdf)
    .save();
}
function generateAdminPdf(){
    
    const Adminpdf = document.querySelector('#records-table')
    html2pdf()
    .from(Adminpdf)
    .save();
}