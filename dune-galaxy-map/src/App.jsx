import { useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  OrbitControls,
  Stars,
  Html,
  Float,
  Line,
  Sparkles,
  Environment,
} from '@react-three/drei';

const planetData = [
  {
    name: 'Arrakis',
    house: 'Casa Atreides (antiga Harkonnen)',
    classification: 'Planeta do deserto – Fonte da Especiaria',
    description:
      'Mundo árido coberto por dunas e lar dos gigantescos vermes-de-areia. É o centro político e econômico do Império por produzir a especiaria Melange.',
    position: [0, 0, 0],
    color: '#e0a860',
    size: 0.6,
  },
  {
    name: 'Caladan',
    house: 'Casa Atreides',
    classification: 'Planeta oceânico',
    description:
      'Planeta natal dos Atreides, coberto por vastos oceanos e falésias. Conhecido por seu clima ameno e cultura refinada.',
    position: [-4, 1.5, -2],
    color: '#3b8bdb',
    size: 0.55,
  },
  {
    name: 'Giedi Prime',
    house: 'Casa Harkonnen',
    classification: 'Mundo industrial',
    description:
      'Planeta sombrio e altamente poluído, dominado por gigantescos complexos industriais e pela brutalidade da Casa Harkonnen.',
    position: [5, -1.2, -1],
    color: '#4f4f5a',
    size: 0.52,
  },
  {
    name: 'Kaitain',
    house: 'Imperador Padishah',
    classification: 'Capital imperial',
    description:
      'Centro administrativo do Império e sede do trono do Padishah Shaddam IV, com arquitetura majestosa e jardins exuberantes.',
    position: [2.5, 2.7, 1.2],
    color: '#d4c26a',
    size: 0.58,
  },
  {
    name: 'Salusa Secundus',
    house: 'Casa Corrino',
    classification: 'Planeta prisional',
    description:
      'Mundo agreste usado como planeta prisão e campo de treinamento dos temidos Sardaukar.',
    position: [1.6, -3.5, 2.4],
    color: '#7f6d4a',
    size: 0.45,
  },
  {
    name: 'Ix',
    house: 'Casa Vernius',
    classification: 'Planeta tecnológico',
    description:
      'Um planeta especializado em inovação tecnológica e engenharia avançada, governado pela Casa Vernius.',
    position: [-2.7, -2.1, 3.2],
    color: '#7d91ff',
    size: 0.48,
  },
  {
    name: 'Tleilax',
    house: 'Bene Tleilax',
    classification: 'Mundo laboratorial',
    description:
      'Lar dos Mestres Tleilaxu, famoso por sua biotecnologia, tanques axlotl e engenharia genética.',
    position: [-5.4, 0.2, 1.6],
    color: '#6d8d5b',
    size: 0.42,
  },
  {
    name: 'Richese',
    house: 'Casa Richese',
    classification: 'Planeta industrial tecnológico',
    description:
      'Concorrente de Ix em inovação, reconhecido por suas criações avançadas e sofisticadas.',
    position: [3.8, 3.1, -2.7],
    color: '#9ab1f7',
    size: 0.46,
  },
  {
    name: 'Wallach IX',
    house: 'Bene Gesserit',
    classification: 'Planeta escola',
    description:
      'Planeta que abriga um dos principais centros de treinamento das Bene Gesserit.',
    position: [-1.1, 4.3, 2.9],
    color: '#d79ccf',
    size: 0.4,
  },
  {
    name: 'Chusuk',
    house: 'Casa menor aliada',
    classification: 'Planeta artístico',
    description:
      'Mundo conhecido por sua música e artes, oferecendo sofisticação cultural ao Império.',
    position: [-0.4, -4.8, -2.2],
    color: '#f3b6a6',
    size: 0.38,
  },
];

const tradeRoutes = [
  ['Arrakis', 'Kaitain'],
  ['Arrakis', 'Caladan'],
  ['Arrakis', 'Giedi Prime'],
  ['Arrakis', 'Ix'],
  ['Kaitain', 'Salusa Secundus'],
  ['Kaitain', 'Wallach IX'],
  ['Ix', 'Richese'],
  ['Giedi Prime', 'Salusa Secundus'],
  ['Caladan', 'Chusuk'],
];

function usePlanetMap() {
  return useMemo(() => {
    const lookup = new Map();
    for (const planet of planetData) {
      lookup.set(planet.name, planet);
    }
    return lookup;
  }, []);
}

function Planet({ data, isActive, onHover, onHoverOut, onClick }) {
  return (
    <Float speed={2} rotationIntensity={1.2} floatIntensity={0.5}>
      <mesh
        position={data.position}
        onPointerOver={(event) => {
          event.stopPropagation();
          onHover(data, event);
        }}
        onPointerMove={(event) => {
          event.stopPropagation();
          onHover(data, event);
        }}
        onPointerOut={(event) => {
          event.stopPropagation();
          onHoverOut();
        }}
        onClick={(event) => {
          event.stopPropagation();
          onClick(data);
        }}
      >
        <sphereGeometry args={[data.size, 32, 32]} />
        <meshStandardMaterial
          emissive={data.color}
          emissiveIntensity={isActive ? 1.2 : 0.6}
          color={isActive ? '#fff4d6' : data.color}
          metalness={0.2}
          roughness={0.5}
        />
        <Html distanceFactor={10} position={[0, data.size + 0.3, 0]}>
          <div
            style={{
              background: 'rgba(10, 9, 19, 0.75)',
              padding: '0.25rem 0.6rem',
              borderRadius: '999px',
              fontSize: '0.75rem',
              color: '#f1e2c5',
              border: `1px solid ${isActive ? '#f8d377' : 'rgba(241,226,197,0.3)'}`,
              boxShadow: '0 6px 12px rgba(0,0,0,0.35)',
              whiteSpace: 'nowrap',
              letterSpacing: '0.03em',
            }}
          >
            {data.name}
          </div>
        </Html>
      </mesh>
    </Float>
  );
}

function GalacticConnections({ map }) {
  const segments = useMemo(() => {
    return tradeRoutes
      .map(([from, to]) => {
        const start = map.get(from)?.position;
        const end = map.get(to)?.position;
        if (!start || !end) return null;
        return { start, end };
      })
      .filter(Boolean);
  }, [map]);

  return (
    <group>
      {segments.map((segment, index) => (
        <Line
          key={`${segment.start.join('-')}-${index}`}
          points={[segment.start, segment.end]}
          color="#7ac7ff"
          lineWidth={1.2}
          dashed
          dashSize={0.5}
          gapSize={0.3}
          opacity={0.4}
          transparent
        />
      ))}
    </group>
  );
}

function Tooltip({ hovered, position }) {
  if (!hovered || !position) return null;
  return (
    <div
      className="tooltip"
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      <div className="title">{hovered.name}</div>
      <div className="subtitle">{hovered.classification}</div>
      <div>{hovered.house}</div>
    </div>
  );
}

function InfoPanel({ planet }) {
  const fallback = planet ?? planetData[0];
  return (
    <div className="info-panel">
      <h1>Mapa das Galáxias do Império</h1>
      <p>
        Explore os principais mundos do universo de <strong>Duna</strong>. Gire, aproxime
        e clique nos planetas para descobrir mais sobre as casas e facções que moldam o
        destino da especiaria.
      </p>
      <h2 style={{ marginTop: '1.2rem', marginBottom: '0.5rem', fontSize: '1.1rem' }}>
        {fallback.name}
      </h2>
      <p style={{ margin: '0.25rem 0', fontWeight: 600 }}>{fallback.house}</p>
      <p style={{ margin: '0.35rem 0', color: '#f1e2c5' }}>{fallback.classification}</p>
      <p>{fallback.description}</p>
      <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#978f80' }}>
        Dica: use o mouse ou o toque para interagir com a galáxia. Pressione shift para
        transladar.
      </p>
    </div>
  );
}

function Scene({ onHover, onHoverOut, onSelect, selectedPlanet }) {
  const planetMap = usePlanetMap();
  return (
    <Canvas camera={{ position: [8, 6, 10], fov: 55 }}>
      <color attach="background" args={[0x05040c]} />
      <ambientLight intensity={0.45} />
      <pointLight position={[8, 8, 4]} intensity={1.2} color="#ffd599" />
      <pointLight position={[-7, -5, -3]} intensity={0.6} color="#7aa2ff" />
      <Environment preset="night" />
      <Stars
        radius={80}
        depth={40}
        count={3500}
        factor={3.2}
        saturation={0}
        fade
      />
      <Sparkles count={120} speed={0.4} size={2.5} opacity={0.6} scale={20} />
      <GalacticConnections map={planetMap} />
      {planetData.map((planet) => (
        <Planet
          key={planet.name}
          data={planet}
          onHover={onHover}
          onHoverOut={onHoverOut}
          onClick={onSelect}
          isActive={selectedPlanet?.name === planet.name}
        />
      ))}
      <OrbitControls
        enablePan
        enableRotate
        enableZoom
        zoomSpeed={0.7}
        maxDistance={25}
        minDistance={4}
      />
    </Canvas>
  );
}

export default function App() {
  const [hovered, setHovered] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState(null);
  const [selected, setSelected] = useState(planetData[0]);

  const handleHover = (planet, event) => {
    setHovered(planet);
    const { clientX, clientY } = event.pointer;
    setTooltipPosition({ x: clientX, y: clientY });
  };

  const handleHoverOut = () => {
    setHovered(null);
    setTooltipPosition(null);
  };

  const handleSelect = (planet) => {
    setSelected(planet);
  };

  return (
    <>
      <Scene
        onHover={handleHover}
        onHoverOut={handleHoverOut}
        onSelect={handleSelect}
        selectedPlanet={selected}
      />
      <InfoPanel planet={selected} />
      <Tooltip hovered={hovered} position={tooltipPosition} />
    </>
  );
}
