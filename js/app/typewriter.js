((ns) => {
    ns.TypeWriter = class TypeWriter {
        constructor(txtElement, words, wait = 2000) {
            this.txtElement = txtElement;
            this.words = words;
            this.txt = '';
            this.wordIndex = 0;
            this.wait = parseInt(wait, 10);
            this.type();
            this.isDeleting = false;
        }

        type() {
            const current = this.wordIndex % this.words.length;
            const fullTxt = this.words[current];
            if (this.isDeleting) {
                this.txt = fullTxt.substring(0, this.txt.length - 1);
            } else {
                this.txt = fullTxt.substring(0, this.txt.length + 1);
            }
            this.txtElement.innerHTML = `<span>${this.txt}</span>`;

            let typeSpeed = 180;

            if (this.isDeleting) {
                typeSpeed /= 2;
            }
            if (!this.isDeleting && this.txt === fullTxt) {
                typeSpeed = this.wait;
                this.isDeleting = true;
            } else if (this.isDeleting && this.txt === '') {
                this.isDeleting = false;
                this.wordIndex++;
                typeSpeed = 350;
            }
            setTimeout(() => this.type(), typeSpeed);
        }
    };
})(extend('DG'));
