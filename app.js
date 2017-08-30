
window.AudioContext = window.AudioContext || window.webkitAudioContext;

	var context = new AudioContext(),
		settings = {
			id: 'keyboard',
			width: 800,
			height: 200,
			startNote: 'A1d',
			whiteNotesColour: '#fff',
			blackNotesColour: '#000',
			borderColour: '#000',
			activeColour: 'gainsboro',
			octaves: 2
		},
		keyboard = new QwertyHancock(settings);
		var myOscilloscope = new WavyJones(context, 'oscilloscope');

		nodes = [];

	keyboard.keyDown = function (note,frequency) {

			var gain = context.createGain();
			var gainSelect = document.querySelector("input[name='gain']");
			var gainValue = gainSelect.value;
			gain.gain.value = gainValue;
			gain.connect(myOscilloscope);


			// BIQUADFILTER
			var filter = context.createBiquadFilter();
			var filterSelect = document.querySelector("select[name='filter']");
			
			var filterType = filterSelect.options[filterSelect.selectedIndex].value;
			filter.type = filterType;
			filter.connect(gain);

			// OSCILLOSCOPE

			myOscilloscope.connect(context.destination);



			// OSCILLATOR
			var oscillator = context.createOscillator();
		
			oscillator.frequency.value = frequency;

			nodes.push(oscillator);

			oscillator.connect(filter);
			// oscillator.connect(filter);
			oscillator.start(0);

			var waveSelect = document.querySelector("select[name='waveForm']");

			var type = waveSelect.options[waveSelect.selectedIndex].value;

			oscillator.type = type;


	}


	keyboard.keyUp = function (note, frequency) {
		var new_nodes = [];

		for (var i = 0; i < nodes.length; i++) {
			if (Math.round(nodes[i].frequency.value) === Math.round(frequency)) {
				nodes[i].stop(0);
				nodes[i].disconnect();
			} else {
				new_nodes.push(nodes[i]);
			}
		}

		nodes = new_nodes;
	};

