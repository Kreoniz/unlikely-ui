export interface StudyProps {
  locale: 'en' | 'ru';
  phase: 'ready' | 'loading' | 'empty' | 'error';
  onRetry: () => void;
}
