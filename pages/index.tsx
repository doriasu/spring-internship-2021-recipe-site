import { FC, useEffect, useState } from "react";
import { Recipe } from "../lib/recipe";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
export const SearchBar: FC = () => {
	const [searchtext, setSearchtext] = useState("");
	const [searchresult, setSearchresult] = useState("");
	const [recipes, setRecipes] = useState<Recipe[] | null>(null);
	const router = useRouter();
	return (
		<div>
			<Link href="/" passHref>
				<div className="container mx-auto h-16">レシピページ</div>
			</Link>
			<div className="text-center container　">
				<input
					value={searchtext}
					onChange={(event) => {
						setSearchtext(event.target.value);
					}}
					type="search"
					name="serch"
					placeholder="Search"
					className="bg-white h-10 px-5 pr-10 rounded-full text-sm focus:outline-none　border-solid border-4 border-gray-600"
					onKeyDown={(e) => {
						if (e.key == "Enter") {
							router.push("/search/" + searchtext);
						}
					}}
				/>
			</div>
		</div>
	);
};
const mainPage: FC = () => {
	const [recipes, setRecipes] = useState<Recipe[]>([]);
	useEffect(() => {
		(async () => {
			const res = await fetch(
				"https://internship-recipe-api.ckpd.co/recipes",
				{
					headers: { "X-Api-Key": process.env.NEXT_PUBLIC_APIKEY },
				}
			);
			const recipes = await res.json();
			setRecipes(recipes["recipes"] as Recipe[]);
		})();
	}, []);
	return (
		<div>
			<SearchBar />
			<br />
			<h1>新着レシピ</h1>
			<div className="grid grid-cols-2">
				{recipes
					? recipes.map((r) => {
							return r.image_url ? (
								<Link
									key={r.id}
									href={"/recipes/" + r.id}
									passHref
								>
									<img src={r.image_url} />
								</Link>
							) : null;
					  })
					: null}
			</div>
		</div>
	);
};
export default mainPage;
