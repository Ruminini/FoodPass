import { getFacesValidator } from "./LoginValidator";

export async function matchFaces(face) {
  let closestPersonId = null;
  let closestDistance = Infinity;
  const faces = await getFacesValidator();
  for (const otherPerson of faces) {
    const otherFace = otherPerson.descriptor;
    const stringDescriptors = otherFace.match(/\-?\d+\.\d+/g);
    if (stringDescriptors && stringDescriptors.length === 128) {
      const floatDescriptors = stringDescriptors.map((x) => parseFloat(x));
      const distance = euclideanDistance(face, floatDescriptors);
      if (distance < closestDistance) {
        closestPersonId = otherPerson.user_id;
        closestDistance = distance;
      }
    }
  }
  return { person: closestPersonId, distance: closestDistance };
}

function euclideanDistance(vector1, vector2) {
  if (vector1.length !== vector2.length) {
    throw new Error("Vectors must be of the same length");
  }
  let sumOfSquares = 0;
  for (let i = 0; i < vector1.length; i++) {
    const difference = vector1[i] - vector2[i];
    sumOfSquares += difference * difference;
  }
  return Math.sqrt(sumOfSquares);
}
