const Logger = {
    mouth: import.meta.env.VITE_MOUTH,

    say(where: string, what: string) {
        if (this.mouth === 'close') return; // 입 닥치고 있으면 출력 안 함

        let sentence: string;

        sentence = `[${where}] ${what}`;

        console.log(sentence);
    },
};

export default Logger;
