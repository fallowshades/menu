import menu from './data'
// get parent element
const sectionCenter = document.querySelector('.section-center') as HTMLElement
const btnContainer = document.querySelector('.btn-container') as HTMLElement
// display all items when page loads

const loader = async (): Promise<MenuItems[]> => {
  const type = 'pizza'
  const API_URL = 'http://localhost:3000/api/menu'
  const API_KEY = 'fallow'
  try {
    console.log(`Fetching menu from ${API_URL}?type=${type}`)
    console.log(`Fetching menu from ${API_URL}?type=${type}`)
    const response = await fetch(`${API_URL}?type=${type}`, {
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
    const menu: MenuItems[] = await response.json()
    return menu // Return the parsed menu
  } catch (error) {
    console.error('Error fetching menu:', error) // Handle any errors
    return [] // Return an empty array to fulfill the return type requirement
  }
}

window.addEventListener('DOMContentLoaded', async function () {
  const menuNew = await loader()

  console.log(menuNew)
  diplayMenuItems(menu)
  displayMenuButtons()
})

interface MenuItems {
  // Define the structure of MenuItem as per your API
  id: number
  type: string
  name: string
  imgUrl: string
  description: string
  price: number
  toppings?: string[] // Optional property
}

export interface MenuItem {
  id: number
  title: string
  category: string
  price: number
  img: string
  desc: string
}

function diplayMenuItems(menuItems: MenuItem[]) {
  let displayMenu: string[] | string = menuItems.map(function (item) {
    // console.log(item);

    return `<article class="menu-item">
          <img src=${item.img} alt=${item.title} class="photo" />
          <div class="item-info">
            <header>
              <h4>${item.title}</h4>
              <h4 class="price">$${item.price}</h4>
              
            </header>
            <p class="item-text">
              ${item.desc}
            </p>
          </div>
        </article>`
  })
  displayMenu = displayMenu.join('') //is a string here
  // console.log(displayMenu);

  sectionCenter.innerHTML = displayMenu
}
function displayMenuButtons() {
  const categories = menu.reduce<string[]>(
    function (values, item: MenuItem) {
      if (!values.includes(item.category)) {
        //lib: es2016
        values.push(item.category)
      }
      return values
    },
    ['all']
  )
  const categoryBtns = categories
    .map(function (category) {
      return `<button type="button" class="filter-btn" data-id=${category}>
          ${category}
        </button>`
    })
    .join('')

  btnContainer.innerHTML = categoryBtns
  const filterBtns = btnContainer.querySelectorAll('.filter-btn')
  console.log(filterBtns)

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      // console.log(e.currentTarget.dataset);
      const category = (e.currentTarget as HTMLElement).dataset.id
      const menuCategory = menu.filter(function (menuItem) {
        // console.log(menuItem.category);
        if (menuItem.category === category) {
          return menuItem
        }
      })
      if (category === 'all') {
        diplayMenuItems(menu)
      } else {
        diplayMenuItems(menuCategory)
      }
    })
  })
}
