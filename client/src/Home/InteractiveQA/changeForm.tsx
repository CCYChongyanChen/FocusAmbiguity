export async function putSelectedQuestion(questions: number[], id: number) {
  try {
    await fetch(
      `https://focusambiguity-f3d2d4c819b3.herokuapp.com/api/users/${id}/selectedQuestions`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ selected_questions: questions }),
      },
    );
  } catch (error) {
    alert("Error updating selected questions, please resubmit");
  }
}

export async function deleteSelectedQuestion(id: number, index: number) {
  try {
    await fetch(
      `https://focusambiguity-f3d2d4c819b3.herokuapp.com/api/users/${id}/selectedQuestions`,
      {
        method: "DELETE",
        body: JSON.stringify({ index: index }),
      },
    );
  } catch (error) {
    alert("Error deleting selected questions, please resubmit");
  }
}

export async function putQuestion(id: number, index: number, question: string) {
  try {
    await fetch(
      `https://focusambiguity-f3d2d4c819b3.herokuapp.com/api/users/${id}/modifyQuestion`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ index, question }),
      },
    );
  } catch (error) {
    alert("Error updating questions, please resubmit");
  }
}
