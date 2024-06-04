// modules/workAroundModule.js
import { getDataByRole, getDataByCompany, salaryData } from './salaryData.js';
import { formatNumber } from './utilities.js';

const getAverageSalaryByRole = role => {
  const roleData = getDataByRole(role);
  const salariesOfRole = roleData.map(obj => obj.salary);
  return formatNumber(calculateAverage(salariesOfRole));
};

const getAverageSalaryByCompany = company => {
  const companyData = getDataByCompany(company);
  const salariesAtCompany = companyData.map(obj => obj.salary);
  return formatNumber(calculateAverage(salariesAtCompany));
};

const getSalaryAtCompany = (role, company) => {
  const companyData = getDataByCompany(company);
  const roleAtCompany = companyData.find(obj => obj.role === role);
  return roleAtCompany ? formatNumber(roleAtCompany.salary) : 'N/A';
};

const getIndustryAverageSalary = () => {
  const allSalaries = salaryData.map(obj => obj.salary);
  return formatNumber(calculateAverage(allSalaries));
};

// Helper Function. Do not edit.
function calculateAverage(arrayOfNumbers) {
  let total = 0;
  arrayOfNumbers.forEach(number => total += number);
  return (total / arrayOfNumbers.length).toFixed(2);
}

export { getAverageSalaryByRole, getAverageSalaryByCompany, getSalaryAtCompany, getIndustryAverageSalary, calculateAverage };
