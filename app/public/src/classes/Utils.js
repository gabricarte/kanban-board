class Utils {

    static randomColor() {

        const colors = ['#bae1ff', '#faf0c2', '#7bd8f1', '#eceae4', '#C7CEEA', '#E2F0CB'];

        let randomColor = colors[Math.floor(Math.random() * colors.length)];

        return randomColor;

    }


}