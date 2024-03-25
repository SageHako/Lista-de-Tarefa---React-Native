import { getDatabase, push, ref, update } from 'firebase/database';

export async function HandleAdd(user, newTask, key, setTasks) {
  const db = getDatabase();
  const userTaskRef = ref(db, `tarefas/${user}`);

  if (newTask === '') {
    return;
  }

  if (key !== '') {
    await update(child(userTaskRef, key), {
      nome: newTask
    }).then(() => {
      console.log('Atualizado');
    });

    return;
  }

  try {
    const taskKey = await push(userTaskRef, {
      nome: newTask
    }).then(() => {
      const datalist = {
        key: taskKey.key,
        nome: newTask
      };
      setTasks(oldTasks => [...oldTasks, datalist]);
    });
  } catch (error) {
    console.log(error);
  }
}
