import { diagram } from '@/content/diagram';
import styles from './SystemDiagram.module.css';

export function SystemDiagram() {
  return (
    <figure role="img" aria-label={diagram.description} className={styles.figure}>
      <figcaption className={`${styles.caption} label-mono text-muted`}>
        <span>{diagram.caption}</span>
        <span>P-01</span>
      </figcaption>
      <div aria-hidden="true" className={styles.diagram}>
        {diagram.nodes.map((node) => (
          <div
            key={node.id}
            data-node={node.id}
            style={{ gridArea: node.id }}
            className={`${styles.node} ${node.accent ? styles.accent : ''}`}
          >
            <span className={styles.title}>{node.title}</span>
            {node.lines.map((line) => (
              <span key={line} className={styles.sub}>{line}</span>
            ))}
          </div>
        ))}
        {diagram.edges.map((edge) => (
          <div key={edge.id} style={{ gridArea: edge.id }} className={styles.edge} data-m={edge.mobile} data-d={edge.desktop}>
            <span className={styles.line} />
            <span className={styles.head} />
            <span className={styles.label}>{edge.label}</span>
          </div>
        ))}
      </div>
    </figure>
  );
}
