export class Report {
    constructor() {
        this.title = '';
        this.content = '';
    }

    display() {
        console.log(`📄 ${this.title}\n\n${this.content}`);
    }
}

export class ReportBuilder {
    constructor() {
        this.report = new Report();
    }

    setTitle(title) {
        this.report.title = title;
        return this;
    }

    setContent(content) {
        this.report.content = content;
        return this;
    }

    build() {
        return this.report;
    }
}