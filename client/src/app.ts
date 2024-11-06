import menu from './data'
function addEventListenerStoreOrder() {
  const saveButtons = document.querySelectorAll('.save-btn')
  saveButtons.forEach((button) => {
    button.addEventListener('click', function (this: HTMLButtonElement) {
      const itemData = JSON.parse(this.getAttribute('data-item') || '{}')
      saveToLocalStorage(itemData)
    })
  })
}

// Function to save item to local storage
function saveToLocalStorage(item: MenuItem | PersonalizedMenuItem) {
  const currentItems = JSON.parse(localStorage.getItem('menuItems') || '[]')
  currentItems.push(item)
  localStorage.setItem('menuItems', JSON.stringify(currentItems))
  alert(`${item.title} has been saved to local storage!`)
}

// get parent element
const sectionCenter = document.querySelector('.section-center') as HTMLElement
const btnContainer = document.querySelector('.btn-container') as HTMLElement
// display all items when page loads

function willItKill(transformedMenuNew: Partial<MenuItem>[]): boolean {
  const urlParams = new URLSearchParams(window.location.search)
  const willItKillQuestion = urlParams.get('idWithCategory')
  if (willItKillQuestion) {
    // Step 3: Find the item with the matching ID
    const menuItem = transformedMenuNew[Number(willItKillQuestion)]
    console.log('WILL KILL', menuItem)
    //.find((item) => item.id.toString() === willItKillQuestion)

    // Step 4: Check if the item exists and if its category/type includes 'pizza'
    if (
      menuItem &&
      menuItem.category && //ts cant guarantee because partial
      menuItem.category.toLowerCase().includes('pizza')
    ) {
      alert('Warning: This pizza might kill you!')
      return true
    } else {
      alert('it wont kill you')
      return false
    }
  }
  return false
}

const loader = async <T extends ApiResponse>(type = ''): Promise<T> => {
  const API_URL = 'http://localhost:3000/api/menu'
  const API_KEY = 'fallow'
  try {
    console.log(`Fetching menu from ${API_URL}?type=${type}`)
    console.log(`Fetching menu from ${API_URL}?type=${type}`)
    const response = await fetch(`${API_URL}${type ? `?type=${type}` : ''}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-zocom': API_KEY,
      },
    })
    // Check if the response is okay
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // Parse the response as JSON
    const menu = await response.json()
    return menu as T // Return the parsed menu
  } catch (error) {
    console.error('Error fetching menu:', error) // Handle any errors
    throw error
    //return { items: [] } // Return an empty array to fulfill the return type requirement
  }
}

window.addEventListener('DOMContentLoaded', async function () {
  diplayMenuItems(menu)
  displayMenuButtons()
  const menuNew = await loader<MenuItemsResponse>() //'pizza'

  console.log(menuNew)
  const transformedMenuNew = (menuNew as MenuItemsResponse).items.map(
    (item): Partial<MenuItem> => ({
      id: item.id,
      title: item.name, // Renaming 'name' to 'title'
      category: item.type, // Renaming 'type' to 'category'
      price: item.price,
      img: item.imgUrl, // Renaming 'imgUrl' to 'img'
      desc:
        item.description +
        (item.toppings ? ' Toppings: ' + item.toppings.join(', ') : ''), // Combining description and optional toppings
    })
  ) as MenuItem[]

  const doINeedOmit = willItKill(transformedMenuNew)
  console.log(doINeedOmit)
  if (doINeedOmit) {
    let personalizedMenu: PersonalizedMenuItem[] = transformedMenuNew
    personalizedMenu = transformedMenuNew
      .filter((item) => item.category.toLowerCase().includes('pizza'))
      .map(({ id, title, category, img }) => ({ id, title, category, img }))

    diplayMenuItems(personalizedMenu)
    displayMenuButtons(personalizedMenu)
  } else {
    diplayMenuItems(transformedMenuNew)
    displayMenuButtons(transformedMenuNew)
  }
})

interface MenuItemRemote {
  id: number
  type: string
  name: string
  imgUrl: string
  description: string
  price: number
  toppings?: string[] // Optional property
}
type ApiResponse = Record<string, any>
type MenuItemsResponse = Record<'items', MenuItemRemote[] | []> //all mongodb responses
// interface MenuItemsResponse {
//   items: MenuItemRemote[] | []
// }
//
export interface MenuItem {
  id: number
  title: string
  category: string
  price: number
  img: string
  desc: string
}

type PersonalizedMenuItem = Omit<MenuItem, 'price' | 'desc'>

// Type Guards
function isMenuItem(item: MenuItem | PersonalizedMenuItem): item is MenuItem {
  return (item as MenuItem).price !== undefined
}

function diplayMenuItems(menuItems: MenuItem[] | PersonalizedMenuItem[]) {
  let displayMenu: string[] | string = menuItems.map(function (item) {
    // console.log(item);
    if (isMenuItem(item)) {
      // This block is executed if item is of type MenuItem
      return `<article class="menu-item">
          <img src=${item.img} alt=${item.title} class="photo" />
          <div class="item-info">
            <header>
              <h4>${item.title}</h4>
              <h4 class="price">$${item.price}</h4>
            </header>
            <p class="item-text">${item.desc}</p>
          </div>
           <footer>
          <a href="index.html?idWithCategory=${item.id}">
          will it kill you?
          </a>
          </footer>
           <button class="save-btn" data-item='${JSON.stringify(item)}'>
              Save to Local Storage
            </button>
        </article>`
    } else {
      // This block is executed if item is of type SimplifiedMenuItem
      return `<article class="menu-item">
          <div class="item-info">
            <header>
              <h4>${item.title}</h4>
              <h4 class="price">0</h4>
            </header>
            <p class="item-text">How dare you. i am not selling, dont look at the description</p>
          </div>
           <footer>
          <a href="index.html?idWithCategory=${item.id}">
          will it kill you?
          </a>
          </footer>
           <button class="save-btn" data-item='${JSON.stringify(item)}'>
              Save to Local Storage
            </button>
        </article>`
    }
  })
  displayMenu = displayMenu.join('') //is a string here
  // console.log(displayMenu);

  sectionCenter.innerHTML = displayMenu
  addEventListenerStoreOrder() //need doM bc we already inserted it into DOM
}
async function displayMenuButtons(
  menuNew?: MenuItem[] | PersonalizedMenuItem[]
) {
  console.log(menu, menuNew)
  //const categories = ['pizza', 'salad', 'drink', 'all']
  const categories = () => {
    if (menuNew && isMenuItem(menuNew[0]))
      //method does only check obj welp
      return (menuNew || menu).reduce<string[]>(
        function (values, item: MenuItem | PersonalizedMenuItem) {
          if (!values.includes(item.category)) {
            //lib: es2016
            values.push(item.category)
          }
          return values
        },
        ['all']
      )

    return ['all', 'pizza', 'sallad', 'drink']
  }
  const categoryBtns = categories() //fun
    .map(function (category) {
      return `<button type="button" class="filter-btn" data-id=${category}>
          ${category}
        </button>`
    })
    .join('')
  //see className coupling
  btnContainer.innerHTML = categoryBtns
  const filterBtns = btnContainer.querySelectorAll('.filter-btn')
  console.log(filterBtns)

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', async function (e) {
      // console.log(e.currentTarget.dataset);
      const category = (
        e.currentTarget as HTMLElement
      ).dataset.id?.toLocaleLowerCase()

      const menuCategory: MenuItem[] = await loader(category).then(
        (response) => {
          const typedResponse = response as MenuItemsResponse
          return typedResponse.items.map((item: MenuItemRemote) => ({
            id: item.id,
            title: item.name, // Map 'name' to 'title'
            category: item.type, // Map 'type' to 'category'
            price: item.price,
            img: item.imgUrl, // Map 'imgUrl' to 'img'
            desc:
              item.description +
              (item.toppings ? ' Toppings: ' + item.toppings.join(', ') : ''), // Combine 'description' and optional toppings
          }))
        }
      )
      // const menuCategory = menu.filter(function (menuItem) {
      //   // console.log(menuItem.category);
      //   if (menuItem.category === category) {
      //     return menuItem
      //   }

      if (category === 'all') {
        const all = menu // menuNew || ----
        diplayMenuItems(all)
      } else {
        diplayMenuItems(menuCategory)
      }
    })
  })
}
