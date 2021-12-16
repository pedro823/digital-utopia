import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { BufferGeometry, Vector3 } from "three";
import { clip } from "../../logic/clip";
import { linearSpace } from "../../logic/linearSpace";

const pointsToIntervalWeights = (points) => {
  const distances = [];

  for (let i = 0; i < points.length - 1; i++) {
    const [a, b] = [points[i], points[i+1]];

    distances.push(a.distanceTo(b));
  }

  const distanceSum = distances.reduce((acc, el) => acc + el, 0);
  return distances.map((x) => x / distanceSum);
}

const calculatePoints = (points, interpolations) => {
  const intervalWeights = pointsToIntervalWeights(points);
  const amountOfPointsPerInterval = intervalWeights.map((x) => Math.round(x * interpolations, 1));
  const totalPoints = amountOfPointsPerInterval.reduce((acc, el) => acc + el, 0);

  const finalPoints = [];

  const intermediaryVectorA = new Vector3();

  for (let i = 0; i < points.length - 1; i++) {
    const [vectorA, vectorB] = [points[i], points[i+1]];
    const pointsInInterval = amountOfPointsPerInterval[i];
    const linSpace = linearSpace(0, 1, pointsInInterval);

    for (let alpha of linSpace) {
      intermediaryVectorA.set(vectorA.x, vectorA.y, vectorA.z);
      intermediaryVectorA.lerp(vectorB, alpha);

      finalPoints.push(intermediaryVectorA.clone());
    }
  }

  return { points: finalPoints, n: totalPoints };
}

export default function LineField(props) {
  const { points, tRef, interpolations = 250 } = props;
  const { points: intermediaryPoints, n } = useMemo(() => calculatePoints(points, interpolations), [points, interpolations]);
  const lineRef = useRef();

  const geometry = new BufferGeometry().setFromPoints(intermediaryPoints);

  useFrame((state, delta) => {
    const t = tRef.current;
    const numPoints = clip(t * n, 0, n);

    // todo figure this out
    const geometry = lineRef.current.geometry;
    geometry.setDrawRange(0, numPoints);
  })

  return (
    <line ref={lineRef} geometry={geometry}>
      <lineBasicMaterial attach="material" color={props.color} linewidth={100} linecap="round" linejoin="round"></lineBasicMaterial>
    </line>
  );
}