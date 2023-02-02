class Utils {

    static randomColor() {

        const colors = ['#bae1ff', '#ffdfba', '#ffffba', '#baffc9', '#C7CEEA', '#E2F0CB'];

        let randomColor = colors[Math.floor(Math.random() * colors.length)];

        return randomColor;

    }


}