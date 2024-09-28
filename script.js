document.getElementById('fileInput').addEventListener('change', handleFileSelect);

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(e.target.result, "text/xml");

            // Verificar si el XML tiene errores
            if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
                alert("Error al analizar el archivo XML.");
                return;
            }

            displayXmlContent(xmlDoc);
        };
        reader.readAsText(file);
    }
}

function displayXmlContent(xmlDoc) {
    const xmlContent = document.getElementById('xmlContent');
    const serializer = new XMLSerializer();
    xmlContent.value = serializer.serializeToString(xmlDoc);

    // Captura de evento doble clic en el contenido XML
    xmlContent.addEventListener('dblclick', function(event) {
        const selectedText = window.getSelection().toString();
        console.log("Texto seleccionado:", selectedText); // Depuración

        if (selectedText) {
            const path = getXPathForText(xmlDoc, selectedText);
            console.log("XPath generado:", path); // Depuración
            document.getElementById('pathOutput').value = path;
        }
    });
}

function getXPathForText(xmlDoc, text) {
    const xpathResult = xmlDoc.evaluate(`//*[contains(text(), '${text}')]`, xmlDoc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    console.log("Resultados de XPath:", xpathResult.snapshotLength); // Depuración

    if (xpathResult.snapshotLength > 0) {
        const node = xpathResult.snapshotItem(0);
        return getElementPath(node);
    }
    return '';
}

function getElementPath(node) {
    if (node.nodeType === Node.ELEMENT_NODE) {
        let path = '';
        while (node) {
            let name = node.nodeName.toLowerCase();
            let sibling = node;
            let count = 1;

            // Contar los hermanos anteriores del mismo tipo
            while (sibling = sibling.previousElementSibling) {
                if (sibling.nodeName === node.nodeName) {
                    count++;
                }
            }

            // Si hay más de uno, agregar el índice
            if (count > 1) {
                name += `[${count}]`;
            }
            path = '/' + name + path;
            node = node.parentElement;
        }
        return path;
    }
    return '';
}
