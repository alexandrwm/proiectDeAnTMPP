import { BudgetManager } from './BudgetManager.js';
import { TransactionFactory } from './TransactionFactory.js';
import { withTVA, withDiscount } from './TransactionDecorator.js';
import { SortContext, SortByAmount, SortByDate, SortByType } from './SortStrategies.js';
import { ReportBuilder } from './ReportBuilder.js';
import { Category } from './CategoryComposite.js';

const budgetManager = BudgetManager.getInstance();
const form = document.getElementById("transaction-form");
const tableBody = document.getElementById("transaction-table");
const sortSelect = document.getElementById("sort-select");

function getStrategy(key) {
  switch (key) {
    case 'amount': return new SortByAmount();
    case 'date': return new SortByDate();
    case 'type': return new SortByType();
    default: return new SortByDate();
  }
}

const rootCategory = new Category("Toate Categoriile");
["Alimentație", "Distracție", "Dorințe", "Nevoi", "Sănătate/Educație", "Diverse", "Economii"].forEach(name => {
    rootCategory.add(new Category(name));
});

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const title = document.getElementById("name").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const category = document.getElementById("category-select").value;
    const modifier = document.getElementById("modifier-select")?.value;

    if (!title || isNaN(amount)) return;

    let transaction = TransactionFactory.createTransaction(title, amount, category);

  if (modifier === 'tva') {
    transaction = withTVA(transaction);
  } else if (modifier === 'discount') {
    transaction = withDiscount(transaction);
  }


    budgetManager.addTransaction(transaction);
    updateUI();
    updateChart();
    form.reset();
});

function updateUI() {
    tableBody.innerHTML = "";
    let transactions = budgetManager.getAll();

    const sortBy = sortSelect?.value;
    if (sortBy) {
        const context = new SortContext(getStrategy(sortBy));
        transactions = context.sort(transactions);
    }

    transactions.forEach((t) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td class="py-1">${t.title}</td>
            <td class="py-1 text-${t.type === 'Cheltuială' ? 'red' : 'green'}-400">${t.amount.toFixed(2)} lei</td>
            <td class="py-1">${t.category ?? '-'}</td>
            <td class="py-1">
                <button onclick="deleteTransaction(${t.id})" class="text-red-500 hover:underline">Șterge</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function deleteTransaction(id) {
    budgetManager.deleteTransaction(id);
    updateUI();
    updateChart();
}

window.deleteTransaction = deleteTransaction;

window.generateReport = function () {
    const transactions = budgetManager.getAll();
    const reportText = transactions.map(t => 
        `- ${t.title}: ${t.amount.toFixed(2)} lei [Categorie: ${t.category}]`
    ).join('\n');

    const report = new ReportBuilder()
        .setTitle("Raport Financiar")
        .setContent(reportText)
        .build();

    const blob = new Blob([`${report.title}\n\n${report.content}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = "Raport_Financiar.txt";
    link.click();

    console.log(reportText);
};

const chartContainer = document.querySelector("#donut-chart");
let chart;

function updateChart() {
    const transactions = budgetManager.getAll();
    const categories = rootCategory.getNames();
    const categoryTotals = categories.map(cat => 
        transactions.filter(t => t.category === cat).reduce((sum, t) => sum + t.amount, 0)
    );

    const options = {
        series: categoryTotals,
        chart: {
            type: 'donut',
            width: '100%',
            height: 400
        },
        labels: categories,
        colors: ["#4ADE80", "#60A5FA", "#F472B6", "#FBBF24", "#F87171", "#F97316", "#A78BFA"],
        dataLabels: { enabled: false },
        legend: {
            position: 'bottom',
            labels: { colors: '#fff' },
        },
        plotOptions: {
            pie: {
                donut: { size: '75%' }
            }
        }
    };

    if (!chart) {
        chart = new ApexCharts(chartContainer, options);
        chart.render();
    } else {
        chart.updateSeries(categoryTotals);
    }
}

updateChart();
sortSelect.addEventListener("change", updateUI);