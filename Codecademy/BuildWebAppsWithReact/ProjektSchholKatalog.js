class School {
    constructor(name, level, numberOfStudents, schoolOverview, principalName) {
      this._name = name;
      this._level = level;
      this._numberOfStudents = numberOfStudents;
      this._schoolOverview = schoolOverview;
      this._principalName = principalName;
    }
  
    
    get name() {
      return this._name;
    }
  
    get level() {
      return this._level;
    }
  
    get numberOfStudents() {
      return this._numberOfStudents;
    }
  
    get schoolOverview() {
      return this._schoolOverview;
    }
  
    get principalName() {
      return this._principalName;
    }
  
    set numberOfStudents(newNumberOfStudents) {
      if(typeof newNumberOfStudents === 'number') {
        this._numberOfStudents = newNumberOfStudents;
      } else {
        console.log('Invalid input: numberOfStudents must be set to a Number.');
      }
    }
  
    quickFacts() {
      console.log(`${this._name} educates ${this._numberOfStudents} students at the ${this._level} school level`);
    }
  
    static pickSubstituteTeacher(substituteTeachers) {
      let myIndex = Math.floor(substituteTeachers.length * Math.random());
      return substituteTeachers[myIndex];
    }
  }
  
  class PrimarySchool extends School {
    constructor(name, numberOfStudents, pickupPolicy) {
      super(name, 'primary', numberOfStudents);
      this._pickupPolicy = pickupPolicy;
    }
  
    getPickupPolicy() {
      return this._pickupPolicy;
    }
  }
  
  class HighSchool extends School {
    constructor(name, numberOfStudents, sportTeams) {
      super(name, 'high', numberOfStudents);
      this._sportTeams = sportTeams;
    }
  
    getSportTeams() {
      console.log(this._sportTeams);
      return this._sportTeams;
    }
  }
  
  class MiddleSchool extends School {
    constructor(name, numberOfStudents, averageTestScores) {
      super(name, 'middle', numberOfStudents);
      this._averageTestScores = averageTestScores;
    }
  
    get averageTestScores() {
      return this._averageTestScores;
    }
  
    set averageTestScores(newAverageTestScores) {
      this._averageTestScores = newAverageTestScores;
    }
  }
  
  class SchoolCatalog {
    constructor() {
      this._schools = [];
    }
  
    addSchool(school) {
      this._schools.push(school);
    }
  
    get schools() {
      return this._schools;
    }
  }
  
  const lorraineHansbury = new PrimarySchool('Lorraine Hansbury', 514, 'Students must be picked up by a parent, guardian, or a family member over the age of 13.');
  
  // Create instances of SchoolCatalog for primary, middle, and high schools
  const primarySchoolCatalog = new SchoolCatalog();
  const middleSchoolCatalog = new SchoolCatalog();
  const highSchoolCatalog = new SchoolCatalog();
  
  // Add schools to respective catalogs
  primarySchoolCatalog.addSchool(lorraineHansbury);
  
  const alSmith = new HighSchool('Al E. Smith', 415, ['Baseball', 'Basketball', 'Volleyball', 'Track and Field']);
  highSchoolCatalog.addSchool(alSmith);
  
  middleSchoolCatalog.addSchool(new MiddleSchool('Middleton Middle', 300, 85));
  
  console.log(lorraineHansbury.quickFacts());
  
  const substituteTeacher = ['Jamal Crawford', 'Lou Williams', 'J. R. Smith', 'James Harden', 'Jason Terry', 'Manu Ginobli'];
  School.pickSubstituteTeacher(substituteTeacher);
  
  console.log(alSmith.getSportTeams());