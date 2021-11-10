const dropArea = document.querySelector('.img-drop-area')
const resultsContainer = document.querySelector('.results')

let image
let model

dropArea.addEventListener('dragover', (e) => {
	e.stopPropagation()
	e.preventDefault()
	e.dataTransfer.dropEffect = 'copy'
})

dropArea.addEventListener('drop', (e) => {
	e.stopPropagation()
	e.preventDefault()

	const file = e.dataTransfer.files[0]

	const reader = new FileReader()
	reader.readAsDataURL(file)

	reader.addEventListener('load', (e) => {
		dropArea.innerHTML = ''
		image = document.createElement('img')
		image.src = e.target.result
		dropArea.style.backgroundImage = `url(${image.src})`
		dropArea.style.backgroundSize = 'cover'
		dropArea.style.borderStyle = 'solid'
        dropArea.style.backgroundPosition = 'center'
		classify()
	})
})

function classify() {
	showResults('<p class="msg">Loading...</p>', resultsContainer)
	model = ml5.imageClassifier('MobileNet', modelReady)
}

function modelReady() {
	model.predict(image, gotResults)
}

function gotResults(error, results) {
	if (error) {
		console.error(error)
	} else {
		const markup = `
			<p>Prediction: <span class="result prediction">${results[0].label}</span></p>
			<p>Probability: <span class="result probability">${(results[0].confidence * 100).toPrecision(2)}%</span></p>
		`
		showResults(markup, resultsContainer)
	}
}


const showResults = (markup, container) => {
	container.innerHTML = ''
	container.insertAdjacentHTML('afterbegin', markup)
}
