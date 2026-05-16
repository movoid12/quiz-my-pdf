// @vitest-environment jsdom

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import QuizLevelModal from '@/components/modals/quiz-level-modal';

function renderModal() {
  const handleProcessPdfWithLevel = vi.fn();
  const setIsModalOpen = vi.fn();
  const view = render(
    <QuizLevelModal
      handlePdfProcess={handleProcessPdfWithLevel}
      setIsModalOpen={setIsModalOpen}
    />,
  );
  return { handleProcessPdfWithLevel, setIsModalOpen, view };
}

describe('QuizLevelModal', () => {
  it('renders title and description', () => {
    renderModal();
    expect(screen.getByText('Choose quiz difficulty')).toBeInTheDocument();
    expect(
      screen.getByText('Select the difficulty level for the generated quiz.'),
    ).toBeInTheDocument();
  });

  it('renders three difficulty buttons', () => {
    renderModal();
    expect(screen.getByText('Easy')).toBeInTheDocument();
    expect(screen.getByText('Medium')).toBeInTheDocument();
    expect(screen.getByText('Hard')).toBeInTheDocument();
  });

  it('calls handleProcessPdfWithLevel with "easy" when Easy clicked', async () => {
    const user = userEvent.setup();
    const { handleProcessPdfWithLevel } = renderModal();
    await user.click(screen.getByText('Easy'));
    expect(handleProcessPdfWithLevel).toHaveBeenCalledWith('easy');
  });

  it('calls handleProcessPdfWithLevel with "challenging but fair" when Medium clicked', async () => {
    const user = userEvent.setup();
    const { handleProcessPdfWithLevel } = renderModal();
    await user.click(screen.getByText('Medium'));
    expect(handleProcessPdfWithLevel).toHaveBeenCalledWith(
      'challenging but fair',
    );
  });

  it('calls handleProcessPdfWithLevel with "hard" when Hard clicked', async () => {
    const user = userEvent.setup();
    const { handleProcessPdfWithLevel } = renderModal();
    await user.click(screen.getByText('Hard'));
    expect(handleProcessPdfWithLevel).toHaveBeenCalledWith('hard');
  });

  it('calls setIsModalOpen(false) on cancel click', async () => {
    const user = userEvent.setup();
    const { setIsModalOpen } = renderModal();
    await user.click(screen.getByText('Cancel'));
    expect(setIsModalOpen).toHaveBeenCalledWith(false);
  });
});
