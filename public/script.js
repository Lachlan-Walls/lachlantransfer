(function() {

    function setPage(p, qs = false) {
        document.querySelector("#nav>.pages").setAttribute("page", p)
        document.querySelector("body").setAttribute("page", p)

        if (qs) {
            document.querySelector("#upload").removeAttribute("hidden")
            document.querySelector("#download").removeAttribute("hidden")
            document.querySelector("#nav>.pages").removeAttribute("hidden")
            document.querySelector("#quickstart").setAttribute("hidden", "")
        }
    }

    document.querySelector("#quickstart>.upload").addEventListener("click", () => setPage("send", true))
    document.querySelector("#nav>.pages>.upload").addEventListener("click", () => setPage("send"))
    document.querySelector("#quickstart>.download").addEventListener("click", () => setPage("receive", true))
    document.querySelector("#nav>.pages>.download").addEventListener("click", () => setPage("receive"))

    function updateHoverState(e) {
        e.stopPropagation()
        e.preventDefault()
        if (e.type == "dragover") e.target.setAttribute("hovering", "")
        else e.target.removeAttribute("hovering")
    }

    function fileSelected(e) {
        updateHoverState(e)
        var files = e.target.files || e.dataTransfer.files
        if (files.length > 1) console.error("one file at a time. first file used.")
        addFile(files[0], files)
    }

    function addFile(file, files) {
        // file.name file.type file.size (bytes)
        // add the file to the thingo

        let div = document.createElement("div")
        div.className = "file"
        let id = Math.round(Math.random() * 10000)
        div.id = "upload_" + id

        let size = file.size
        let exts = ["bytes", "kilobytes", "megabytes"]
        let ei = 0
        while (size > 1000) {
            if (ei < 2) {
                ei += 1
                size = Math.round(size / 10) / 100
            } else break
        }

        div.innerHTML = "<h3>" + file.name + "</h3><p>type: " + file.type + "</p><p>" + size + " " + exts[ei] + "</p><form method=post enctype=multipart/form-data><input type='file' style='display: none' name='file'><input class='submit' type='submit' value='UPLOAD'></form>"
        document.querySelector("#upload>.container").insertBefore(div, document.querySelector("#upload>.container>.addfile"))
        document.querySelector("#upload_" + id + ">form>input").files = files

    }

    document.querySelector("#upload>.container>.addfile>.fileselect").addEventListener("change", fileSelected, false)
    document.querySelector("#upload>.container>.addfile").addEventListener("click", e => {
        document.querySelector("#upload>.container>.addfile>.fileselect").click()
    })

    var xhr = new XMLHttpRequest()
    if (xhr.upload) {
        var filedrag = document.querySelector("#upload>.container>.addfile")
        filedrag.addEventListener("dragover", updateHoverState, false)
        filedrag.addEventListener("dragleave", updateHoverState, false)
        filedrag.addEventListener("drop", fileSelected, false)
    }

})();