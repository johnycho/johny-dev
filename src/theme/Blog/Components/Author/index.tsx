/**
 * Docusaurus theme-classic Author 스위즐.
 * 원본과 동일하되, 직책(title)의 "Kurly" 텍스트를 컬리 로고(홈페이지 링크)로 치환한다.
 */
import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import AuthorSocials from '@theme/Blog/Components/Author/Socials';
import Heading from '@theme/Heading';
import type {Props} from '@theme/Blog/Components/Author';
import styles from './styles.module.css';

function MaybeLink(props: any): ReactNode {
  if (props.href) {
    return <Link {...props} />;
  }
  return <>{props.children}</>;
}

// 직책의 "Kurly"를 컬리 로고 이미지(홈페이지 링크)로 치환
function AuthorTitle({title}: {title: string}): ReactNode {
  const KURLY = 'Kurly';
  const idx = title.indexOf(KURLY);
  return (
    <small className={styles.authorTitle} title={title}>
      {idx === -1 ? (
        title
      ) : (
        <>
          {title.slice(0, idx)}
          <Link
            href="https://www.kurly.com/"
            className="kurly-logo-link"
            aria-label="Kurly 홈페이지">
            <img src="/img/kurly-logo.svg" alt="Kurly" />
          </Link>
          {title.slice(idx + KURLY.length)}
        </>
      )}
    </small>
  );
}

function AuthorName({name, as}: {name: string; as?: any}): ReactNode {
  if (!as) {
    return <span className={styles.authorName}>{name}</span>;
  }
  return (
    <Heading as={as} className={styles.authorName}>
      {name}
    </Heading>
  );
}

function AuthorBlogPostCount({count}: {count: number}): ReactNode {
  return <span className={clsx(styles.authorBlogPostCount)}>{count}</span>;
}

export default function BlogAuthor({as, author, className, count}: Props): ReactNode {
  const {name, title, url, imageURL, email, page} = author;
  const link =
    (page as any)?.permalink || url || (email && `mailto:${email}`) || undefined;
  return (
    <div
      className={clsx(
        'avatar margin-bottom--sm',
        className,
        styles[`author-as-${as}` as keyof typeof styles],
      )}>
      {imageURL && (
        <MaybeLink href={link} className="avatar__photo-link">
          <img
            className={clsx('avatar__photo', styles.authorImage)}
            src={imageURL}
            alt={name}
          />
        </MaybeLink>
      )}

      {(name || title) && (
        <div className={clsx('avatar__intro', styles.authorDetails)}>
          <div className="avatar__name">
            {name && (
              <MaybeLink href={link}>
                <AuthorName name={name} as={as} />
              </MaybeLink>
            )}
            {count !== undefined && <AuthorBlogPostCount count={count} />}
          </div>
          {!!title && <AuthorTitle title={title} />}
          <AuthorSocials author={author} />
        </div>
      )}
    </div>
  );
}
