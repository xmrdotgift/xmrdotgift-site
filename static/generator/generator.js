function addNewQRContainer(target) {
    let div = document.createElement("div");
    div.setAttribute("class", "qr")
    target.appendChild(div);
}

function generateWalletQRCode(target, size) {
    let cnUtil = cnUtilGen(moneroConfig);
    let seed = cnUtil.sc_reduce32(cnUtil.rand_32());
    let keys = cnUtil.create_address(seed);
    new QRCode(target, {
        text: "monero_wallet:"+keys.public_addr+"?spend_key="+keys.spend.sec+"&view_key="+keys.view.sec,
        width: size,
        height: size,
        correctLevel: QRCode.CorrectLevel.L
    });
}

function submitForm(form) {
    let format = form.elements.namedItem("format").value;
    let template = form.elements.namedItem("template").value;
    let num_pages = parseInt(form.elements.namedItem("pages").value);
    updateView(format, template, num_pages);
}

let formats = {
    "a4": {
        "width": 793,
        "height": 1122
    },
    "Letter": {
        "width": 815,
        "height": 1053
    }
};

let templates = {
    "black": {
        "qr_size": 132
    },
    "circles": {
        "qr_size": 132
    },
    "gift4you": {
        "qr_size": 132
    },
    "giftbox": {
        "qr_size": 132
    },
    "orange": {
        "qr_size": 132
    }
}

function updateTemplatePreview(template) {
    let previewFront = document.getElementById("template_preview_front");
    previewFront.setAttribute("src", "/templates/"+template+"/front.png");

    let previewBack = document.getElementById("template_preview_back");
    previewBack.setAttribute("src", "/templates/"+template+"/back.png");
}

function updateView(format, template, num_pages) {
    let page = document.getElementById("page");

    const qr_padding = 6;
    let qr_size = templates[template]["qr_size"];
    let page_width = formats[format]["width"];
    let page_height = formats[format]["height"];
    let qrs_per_page = Math.floor(page_width / (qr_size + qr_padding)) * Math.floor(page_height / (qr_size + qr_padding));

    page.innerHTML = "";

    for ( var i = 0; i < qrs_per_page * num_pages; i++ ) {
        addNewQRContainer(page);
        generateWalletQRCode(page.lastChild, qr_size);
    }
}

function printView() {
    window.print();
}

updateTemplatePreview(document.getElementById("select_template").value);
