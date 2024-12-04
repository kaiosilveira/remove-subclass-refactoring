[![Continuous Integration](https://github.com/kaiosilveira/remove-subclass-refactoring/actions/workflows/ci.yml/badge.svg)](https://github.com/kaiosilveira/remove-subclass-refactoring/actions/workflows/ci.yml)

ℹ️ _This repository is part of my Refactoring catalog based on Fowler's book with the same title. Please see [kaiosilveira/refactoring](https://github.com/kaiosilveira/refactoring) for more details._

---

# Remove Subclass

**Formerly: Replace Subclass with Fields**

<table>
<thead>
<th>Before</th>
<th>After</th>
</thead>
<tbody>
<tr>
<td>

```javascript
class Person {
  get genderCode() {
    return 'X';
  }
}

class Male extends Person {
  get genderCode() {
    return 'M';
  }
}

class Female extends Person {
  get genderCode() {
    return 'F';
  }
}
```

</td>

<td>

```javascript
class Person {
  get genderCode() {
    return this._genderCode;
  }
}
```

</td>
</tr>
</tbody>
</table>

**Inverse of: [Replace Type Code with Subclasses](https://github.com/kaiosilveira/replace-type-code-with-subclasses-refactoring)**

Sublcasses are useful and often provide a good degree of code separation, encapsulation, and isolation. Sometimes, though, as our understanding about the problem domain grows, we need to distil the model a bit, and this may imply pruning some leaves (a.k.a. removing some subclasses and / or cutting down some class hierarchies). This refactoring helps with that.

## Working example

Our working example is straightfoward: we have a gender-based class hierarchy built around `Person`. In the current state of the program, though, these subclasses (`Male` and `Female`) do nothing but overriding a `genderCode` getter. Our goal here is to move this logic into the superclass and get rid of the subclasses.

### Test suite

Testing is quite simple here - we cover the gender code for each subclass:

```javascript
describe('Person', () => {
  it('should have genderCode as X', () => {
    const person = new Person('Alex Doe');
    expect(person.genderCode).toBe('X');
  });
});

describe('Male', () => {
  it('should have genderCode as M', () => {
    const male = new Male('John Doe');
    expect(male.genderCode).toBe('M');
  });
});

describe('Female', () => {
  it('should have genderCode as F', () => {
    const female = new Female('Jane Doe');
    expect(female.genderCode).toBe('F');
  });
});
```

It also covers some basic behavior around loading data from a given input, which is omitted for brevity.

That's all we need to get started.

### Steps

Instantiation control is one of the biggest concerns when it comes to removing something. So, to ensure we know where every subclass is created, we start by introducing a factory function to create them:

```diff
+export function createPerson(aRecord) {
+  let p;
+  switch (aRecord.gender) {
+    case 'M':
+      p = new Male(aRecord.name);
+      break;
+    case 'F':
+      p = new Female(aRecord.name);
+      break;
+    default:
+      p = new Person(aRecord.name);
+      break;
+  }
+  return p;
+}
```

We then update `loadFromInput` to use our recently created factory:

```diff
 export function loadFromInput(data) {
   const result = [];
   data.forEach(aRecord => {
-    let p;
-    switch (aRecord.gender) {
-      case 'M':
-        p = new Male(aRecord.name);
-        break;
-      case 'F':
-        p = new Female(aRecord.name);
-        break;
-      default:
-        p = new Person(aRecord.name);
-        break;
-    }
-    return result.push(p);
+    return result.push(createPerson(aRecord));
   });
   return result;
 }
```

The code is functional, bug ugly, so we [inline some variables](https://github.com/kaiosilveira/inline-variable-refactoring) at `createPerson`...

```diff
 export function createPerson(aRecord) {
-  let p;
   switch (aRecord.gender) {
     case 'M':
-      p = new Male(aRecord.name);
-      break;
+      return new Male(aRecord.name);
     case 'F':
-      p = new Female(aRecord.name);
-      break;
+      return new Female(aRecord.name);
     default:
-      p = new Person(aRecord.name);
-      break;
+      return new Person(aRecord.name);
   }
-  return p;
 }
```

and [inline the loop with a pipeline](https://github.com/kaiosilveira/replace-loop-with-pipeline-refactoring) at `loadFromInput`:

```diff
 export function loadFromInput(data) {
-  const result = [];
-  data.forEach(aRecord => {
-    return result.push(createPerson(aRecord));
-  });
-  return result;
+  return data.map(aRecord => createPerson(aRecord));
 }
```

And as a last step before start the fun part of deleting things, we [extract](https://github.com/kaiosilveira/extract-function-refactoring) the `isMale` logic into a function:

```diff
 const numberOfMales = people.filter(p => p instanceof Male).length;
 console.log(`Number of males: ${numberOfMales}`);
+
+export function isMale(person) {
+  return person instanceof Male;
+}
```

Now, on to the core work. We first move `isMale` to `Person`, as a getter:

```diff
 export class Person {
+
+  get isMale() {
+    return this instanceof Male;
+  }
 }
```

Just so we can use `Person.isMale` instead of the isolated implementation (which can be safely removed):

```diff
-const numberOfMales = people.filter(p => p instanceof Male).length;
+const numberOfMales = people.filter(p => p.isMale).length;
 console.log(`Number of males: ${numberOfMales}`);
-
-export function isMale(person) {
-  return person instanceof Male;
-}
```

Moving on, we now add a `genderCode` field as part of the base `Person` class:

```diff
 export class Person {
-  constructor(name) {
+  constructor(name, genderCode) {
     this._name = name;
+    this._genderCode = genderCode ?? 'X';
   }
   get genderCode() {
-    return 'X';
+    return this._genderCode;
   }
```

This will be the basis for us to remove the subclasses.

We can now return a `Person` with gender `M` to represent males in the `createPerson` factory function:

```diff
 export function createPerson(aRecord) {
   switch (aRecord.gender) {
     case 'M':
-      return new Male(aRecord.name);
+      return new Person(aRecord.name, 'M');
     case 'F':
       return new Female(aRecord.name);
     default:
```

But we also need to update the internal logic of `Person.isMale` to look at the `genderCode` field:

```diff
 export class Person {
   get isMale() {
-    return this instanceof Male;
+    return this.genderCode === 'M';
   }
 }
```

And, finally, we can remove the `Male` subclass:

```diff
-export class Male extends Person {
-  get genderCode() {
-    return 'M';
-  }
-}
```

We repeat the process for `Female`. First returning a `Person` with genderCode `F`:

```diff
 export function createPerson(aRecord) {
     case 'M':
       return new Person(aRecord.name, 'M');
     case 'F':
-      return new Female(aRecord.name);
+      return new Person(aRecord.name, 'F');
     default:
       return new Person(aRecord.name);
   }
```

And then [removing](https://github.com/kaiosilveira/remove-dead-code-refactoring) the subclass:

```diff
-import { Person } from '../person/index.js';
-
-export class Female extends Person {
-  get genderCode() {
-    return 'F';
-  }
-}
```

As a last touch, we can provide a `X` as the default gender for a `Person` in the `createPerson` factory function:

```diff
export function createPerson(aRecord) {
     case 'F':
       return new Person(aRecord.name, 'F');
     default:
-      return new Person(aRecord.name);
+      return new Person(aRecord.name, 'X');
   }
 }
```

And remove the gender fallback at `Person`'s initialization:

```diff
 export class Person {
   constructor(name, genderCode) {
     this._name = name;
-    this._genderCode = genderCode ?? 'X';
+    this._genderCode = genderCode;
   }
```

And that's all for this one. There's now only a base `Person` class, with the gender code correctly implemented.

### Commit history

Below there's the commit history for the steps detailed above.

| Commit SHA                                                                                                             | Message                                                                        |
| ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| [6f5a7cc](https://github.com/kaiosilveira/remove-subclass-refactoring/commit/6f5a7cc7c4efae1776b19004d4b9515b46610821) | introduce function to create a person from a given record                      |
| [f40088c](https://github.com/kaiosilveira/remove-subclass-refactoring/commit/f40088cb101619a03deb13c0166ed2bc3c1ab1d5) | update `loadFromInput` to use `createPerson`                                   |
| [fc3841e](https://github.com/kaiosilveira/remove-subclass-refactoring/commit/fc3841ef0baa70dd7cda50b5b26c6b4435e6c00a) | simplify implementation of `createPerson`                                      |
| [2bb61a7](https://github.com/kaiosilveira/remove-subclass-refactoring/commit/2bb61a78b442b6e70cf0ceebd18c1394f3d3e8cc) | simplify implementation of `loadFromInput`                                     |
| [8cdf6dd](https://github.com/kaiosilveira/remove-subclass-refactoring/commit/8cdf6dd9a1cb54d77bdfe16a94104ce8d2874092) | encapsulate check for male as `isMale`                                         |
| [9dc30f4](https://github.com/kaiosilveira/remove-subclass-refactoring/commit/9dc30f40e4af754e86a66589f595e8a124dd3313) | implement `isMale` getter at `Person`                                          |
| [bbe54f1](https://github.com/kaiosilveira/remove-subclass-refactoring/commit/bbe54f13539c778713c6edaeb29889c7263d19fb) | update client code to use `Person.isMale` instead of isolated implementation   |
| [ce204a3](https://github.com/kaiosilveira/remove-subclass-refactoring/commit/ce204a332a625562e2f4181078eb0f0ce78a5ec3) | add `genderCode` as part of `Person`'s initialization                          |
| [1ca3c84](https://github.com/kaiosilveira/remove-subclass-refactoring/commit/1ca3c84fa325ab503d734f8876d0b555024a67df) | return `Person` with gender `M` for males at `createPerson` factory function   |
| [90276b8](https://github.com/kaiosilveira/remove-subclass-refactoring/commit/90276b8578e48050eb532d9e973c09a04a84ec48) | update `Person.isMale` internal logic to check `genderCode`                    |
| [37df6bc](https://github.com/kaiosilveira/remove-subclass-refactoring/commit/37df6bcf3b3488944ae46b37dfbc37cc725a720b) | remove `Male` subclass                                                         |
| [a87da9f](https://github.com/kaiosilveira/remove-subclass-refactoring/commit/a87da9fdf15b3aa316916fce89deede4a64a1b28) | return `Person` with gender `F` for females at `createPerson` factory function |
| [9ce8b40](https://github.com/kaiosilveira/remove-subclass-refactoring/commit/9ce8b40742c07009cf5441255f3750aa27a3444b) | remove `Female` subclass                                                       |
| [b0abe9e](https://github.com/kaiosilveira/remove-subclass-refactoring/commit/b0abe9e18082a65110afb45239afc8a6cad5fdb7) | provide `X` as default gender at `createPerson` factory function               |
| [14ec949](https://github.com/kaiosilveira/remove-subclass-refactoring/commit/14ec94925579d69311b8750ca28e8c30510b8b90) | remove gender fallback at `Person` initialization                              |

For the full commit history for this project, check the [Commit History tab](https://github.com/kaiosilveira/remove-subclass-refactoring/commits/main).
