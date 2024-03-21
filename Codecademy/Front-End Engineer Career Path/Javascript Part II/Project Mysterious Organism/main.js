// Returns a random DNA base
const returnRandBase = () => {
    const dnaBases = ['A', 'T', 'C', 'G']
    return dnaBases[Math.floor(Math.random() * 4)] 
  }
  //console.log('Test 1: ' + returnRandBase());
  
  // Returns a random single strand of DNA containing 15 bases
  const mockUpStrand = () => {
    const newStrand = []
    for (let i = 0; i < 15; i++) {
      newStrand.push(returnRandBase())
    }
    return newStrand
  }
  //console.log('Test 2: ' + mockUpStrand());
  
  // 3 
  function pAequorFactory(speNum, dnaArr) {
    return {
      specimenNum: speNum,
      dna: dnaArr,
      mutate() {
        const randomNumber = Math.floor(Math.random() * 15);
        if(dnaArr[randomNumber] === 'A') {
          dnaArr[randomNumber] = returnRandBaseforA();
        } else if(dnaArr[randomNumber] === 'T') {
          dnaArr[randomNumber] = returnRandBaseforT();
        } else if(dnaArr[randomNumber] === 'C') {
          dnaArr[randomNumber] = returnRandBaseforC();
        } else if(dnaArr[randomNumber] === 'G') {
          dnaArr[randomNumber] = returnRandBaseforG(); 
        }
        console.log(this.dna)
      },
      compareDNA(pAequor) {
        let sameBases = 0;
        for(let i = 0 ; i < this.dna.length ; i++) {
          if (this.dna[i] === pAequor.dna[i]) {
            sameBases ++ ;
          }
        }
        const percentage = (sameBases / this.dna.length) * 100 ;
        if(percentage === 100) {
          console.log ('These DNAs are the same!')
        } else {
          console.log(`Spimen #${this.specimenNum} and specimen #${pAequor.specimenNum} have ${percentage.toFixed(2)}% DNA in common.`)
        } 
      }
    }
  }
  
  // pAequorFactory(1,mockUpStrand())
  
  //console.log('Test 3: ');
  //console.log(pAequorFactory(2,mockUpStrand()));
  
  // 4 
  const returnRandBaseforA = () => {
    const dnaBases = ['T', 'C', 'G']
    return dnaBases[Math.floor(Math.random() * 3)] 
  }
  
  const returnRandBaseforT = () => {
    const dnaBases = ['A', 'C', 'G']
    return dnaBases[Math.floor(Math.random() * 3)] 
  }
  
  const returnRandBaseforC = () => {
    const dnaBases = ['A', 'T', 'G']
    return dnaBases[Math.floor(Math.random() * 3)] 
  }
  
  const returnRandBaseforG = () => {
    const dnaBases = ['A', 'T', 'C']
    return dnaBases[Math.floor(Math.random() * 3)] 
  }
  /*
  console.log('Test 4: ')
  const test4 = pAequorFactory(3,mockUpStrand())
  console.log('zu sehen was ich neuen dna habe')
  console.log(test4)
  console.log('zu kontrollieren was ich mutate bekome')
  test4.mutate()
  */
  
  console.log('Test 5: ')
  const test5 = pAequorFactory(4,mockUpStrand())
  //const test5_2 = pAequorFactory(5,mockUpStrand())
  test5.compareDNA(pAequorFactory(5,mockUpStrand()))
  
  